import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload: any = await verifyToken(token);

    // 2️⃣ Parse body
    
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }
    

    // 3️⃣ Fetch invoice with required relations
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
                    createdByUserId: true,
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
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount, // cents
      currency: "usd",
      metadata: {
        invoiceId: invoice.Id,
        purchaseOrderId: invoice.purchaseOrderId,
        customerId:
          invoice.purchaseOrder.rfqList.rfq.createdByUserId,
        initiatedBy: payload.Id,
      },
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }

    // console.log(paymentIntent, 'intenttt');
    
    // 5️⃣ Persist Payment record (IMPORTANT)
    await prisma.payment.create({
      data: {
        invoice: {
          connect: { Id: invoice.Id },
        },
        purchaseOrder: {
          connect: { Id: invoice.purchaseOrderId },
        },
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
        amount: invoice.amount,
        currency: "USD",
        status: "PROCESSING",
      },
    });
    
    // 6️⃣ Return client secret
    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Create payment intent error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to create payment intent",
      },
      { status: 500 }
    );
  }
}
