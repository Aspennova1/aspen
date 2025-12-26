import { stripe } from "@/lib/stripe";
import { getAuthUser } from "@/utils/auth";
import { notFound, redirect } from "next/navigation";
import CheckoutForm from "./_components/CheckoutForm";
import prisma from "@/lib/prisma";

type Props = {
  params: { invoiceId: string };
};

const PaymentPage = async({params}: Props)=>{
    const { invoiceId } = await params;
    const user = await getAuthUser();

    if(!user || !user.Id) redirect('/');

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
      notFound();
    }

    if (invoice.purchaseOrder.rfqList.rfq.createdByUserId !== user.Id) {
      redirect('/unauthorized');
    }

    const isPayable = invoice.statusCode === 'SENT';

    let clientSecret: string | undefined = undefined;

    if(isPayable){

      const lastPayment = await prisma.payment.findFirst({
        where: { invoiceId: invoice.Id },
        orderBy: { createdAt: "desc" },
      });
      
      
      // 🟡 CASE 1: Payment already in progress → reuse
      // if (lastPayment && lastPayment.status === "PROCESSING") {
      //   console.log('processing...');
      //   clientSecret = lastPayment.stripeClientSecret;
      // }

      // ❌ CASE 2: Payment already completed
      if (lastPayment && lastPayment.status === "SUCCEEDED") {
        redirect("/customer/accepted-rfqs");
      }

      // 🔁 CASE 3: No payment OR retry allowed
      else {
      // 2️⃣ Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: invoice.amount, // cents
        currency: "USD",
        // customer
        metadata: {
          invoiceId: invoice.Id,
          invoiceNumber: invoice.invoiceNumber,
          purchaseOrderId: invoice.purchaseOrderId,
          userId: user.Id,
          name: invoice.purchaseOrder.rfqList.rfq.name,
          email: invoice.purchaseOrder.rfqList.rfq.email,
          company: invoice.purchaseOrder.rfqList.rfq.company
        },
      },
      // {
      //   idempotencyKey: `payment_intent${invoice.invoiceNumber}${invoice.purchaseOrderId}`
      // }
    );
    
    console.log(paymentIntent, 'swdIntent');
    
      if (!paymentIntent.client_secret) {
        throw new Error("Failed to create payment intent");
      }

      clientSecret = paymentIntent.client_secret;

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
    }
  }
  
  // 4️⃣ Render checkout
  return (
    <CheckoutForm
      clientSecret={clientSecret}
      invoice={invoice}
      error={
         !isPayable
          ? invoice.status === "PAID"
            ? "This invoice is already paid"
            : invoice.status === "CANCELLED"
            ? "This invoice has been cancelled"
            : "This invoice is not ready for payment"
          : undefined
      }
    />
  );
}

export default PaymentPage