import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth (Customer only)
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload: any = await verifyToken(token);

    // Customer role (adjust if needed)
    if (payload.roleId !== 3) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // 📥 Parse body
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json(
        { message: "Invoice ID required" },
        { status: 400 }
      );
    }

    // 🔎 Fetch invoice + ownership check
    const invoice = await prisma.invoice.findUnique({
        where: { Id: invoiceId },
        include: {
            purchaseOrder: {
                include: {
                    rfqList: {
                    include: {
                        rfq: {
                        select: {
                            name: true,
                            email: true,
                            company: true,
                            createdByUserId: true
                        },
                        },
                    },
                    },
                },
            },
        },
        });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    // 🔐 Ownership check
    if (
      invoice.purchaseOrder.rfqList.rfq.createdByUserId !==
      payload.Id
    ) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }
    
    // 🚫 Prevent duplicate payment
    const existingPayment =
      await prisma.payment.findFirst({
        where: {
          invoiceId,
          status: {
            in: ['PROCESSING', "SUCCEEDED"],
          },
        },
      });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already in progress" },
        { status: 409 }
      );
    }

    // await stripe.paymentIntents.create({
    //     amount: invoice.amount, // cents
    //     currency: "USD",
    //     metadata: {
    //       invoiceId: invoice.Id,
    //       purchaseOrderId: invoice.purchaseOrderId,
    //       userId: payload.Id,
    //     },
    //   });

    // 💳 Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: payload.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
                metadata:{
                    name: invoice.purchaseOrder.rfqList.rfq.name,
                    email: invoice.purchaseOrder.rfqList.rfq.email,
                    company: invoice.purchaseOrder.rfqList.rfq.company
                },
              name: "Invoice Payment",
              description:
                invoice.description ||
                "Service Invoice",
            },
            unit_amount: invoice.amount, // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/cancel`,
      metadata: {
        invoiceId,
        purchaseOrderId:
          invoice.purchaseOrderId,
      },
    });
    

    // 🧾 Create Payment record
    await prisma.payment.create({
      data: {
        // purchaseOrderId: invoice.purchaseOrderId,
        stripePaymentIntentId: session.payment_intent as string,
        stripeClientSecret: session.client_secret,
        stripeCheckputSessionId: session.id,
        amount: invoice.amount,
        currency: "USD",
        status: "PROCESSING",
        purchaseOrder: {
            connect: {
                Id: invoice.purchaseOrderId,
            },
            },

            invoice: {
            connect: {
                Id: invoiceId,
            },
        },
      },
    });

    return NextResponse.json(
      {
        checkoutUrl: session.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Stripe checkout error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error?.message ||
          "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
