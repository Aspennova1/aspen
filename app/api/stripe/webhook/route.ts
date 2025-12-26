import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import {Resend} from 'resend'
import { formatCurrency } from "@/lib/formatters";
import PayReceiptEmail from '@/components/email/PayReceiptEmail'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // ✅ PAYMENT SUCCESS
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const invoiceId = paymentIntent.metadata.invoiceId;
        const name = paymentIntent.metadata.name;
        const email = paymentIntent.metadata.email;
        const company = paymentIntent.metadata.company;

        if (!invoiceId) break;

        // Update payment
        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: "SUCCEEDED",
          },
        });

        // Update invoice
        await prisma.invoice.update({
          where: { Id: invoiceId },
          data: {
            statusCode: "PAID",
            paidAt: new Date(),
          },
        });

        await resend.emails.send({
          from: `Support <${process.env.SENDER_EMAIL}>`,
          to: 'dk40828@gmail.com',
          subject: "Order Confirmation",
          react: PayReceiptEmail({id: invoiceId, company:'Aspen Groups', name, email, createdAt: paymentIntent.created*1000, pricePaidInCents: paymentIntent.amount }),
        })

        break;
      }

      // ❌ PAYMENT FAILED
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: "FAILED",
          },
        });

        break;
      }

      // ❌ PAYMENT CANCELLED
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: "CANCELLED",
          },
        });

        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        console.log('Trigerred account updated event...');
        console.log('Trigerred account updated event...');

        if (!account.id) break;

        const chargesEnabled = !!account.charges_enabled;
        const payoutsEnabled = !!account.payouts_enabled;

        // Find vendor onboarding by Stripe account
        const onboarding = await prisma.vendorOnboarding.findUnique({
          where: {
            stripeConnectedAccountId: account.id,
          },
        });

        if (!onboarding) {
          console.warn(
            `VendorOnboarding not found for Stripe account ${account.id}`
          );
          break;
        }

        // ✅ Vendor fully onboarded
        if (chargesEnabled && payoutsEnabled) {
          console.log('trueeeeee', 'trueeeeeeeee');
          
          await prisma.vendorOnboarding.update({
            where: { Id: onboarding.Id },
            data: {
              status: "COMPLETED",
              chargesEnabled: true,
              payoutsEnabled: true,
            },
          });
        }
        // ❌ Vendor restricted / incomplete
        else {
          await prisma.vendorOnboarding.update({
            where: { Id: onboarding.Id },
            data: {
              status: "RESTRICTED",
              chargesEnabled,
              payoutsEnabled,
            },
          });
        }

        break;
      }

      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer;

        const vendorPayoutId = transfer.metadata?.vendorPayoutId;
        console.log(transfer.metadata, 'metadataaa');
        
        if (!vendorPayoutId) break;

        // 1️⃣ Fetch payout to get invoiceId
        const payout = await prisma.vendorPayout.findUnique({
          where: { Id: vendorPayoutId },
          include: {
            invoice: true,
          },
        });

        if (!payout) break;

        // 2️⃣ Mark payout as PAID
        await prisma.vendorPayout.update({
          where: { Id: payout.Id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        // 3️⃣ Mark vendor invoice as PAID
        await prisma.invoice.update({
          where: { Id: payout.invoiceId },
          data: {
            statusCode: "PAID",
            paidAt: new Date(),
          },
        });

        break;
      }

      // case "payout.failed": {
      //   const transfer = event.data.object as Stripe.Transfer;

      //   const vendorPayoutId = transfer.metadata?.vendorPayoutId;
      //   if (!vendorPayoutId) break;

      //   await prisma.vendorPayout.update({
      //     where: { Id: vendorPayoutId },
      //     data: {
      //       status: "FAILED",
      //     },
      //   });

      //   // ❌ DO NOT touch invoice here

      //   break;
      // }

      case 'account.application.deauthorized':{

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
