import PayReceiptEmail from '@/components/email/PayReceiptEmail';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { getResend } from '@/lib/resend';
import { getStripe } from '@/lib/stripe'
import { getAuthUser } from '@/utils/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function PaymentSuccess({searchParams}:{searchParams:{session_id: string}}) {
//     const {session_id} = await searchParams;
//     const paymentIntent  = await stripe.checkout.sessions.retrieve(session_id);
//     // const paymentIntent1  = await stripe.paymentIntents.retrieve(paymentIntent.);

//     console.log(paymentIntent, 'Payment Session');
//     console.log(paymentIntent.metadata, 'metadata Session');
    
//   return (
//     <div>PaymentSuccess</div>
//   )
// }
export default async function PaymentSuccess({searchParams}:{searchParams:{payment_intent: string}}) {
    const {payment_intent} = await searchParams;
    const user = await getAuthUser();
    // const paymentIntent  = await stripe.checkout.sessions.retrieve(session_id);
    const paymentIntent  = await getStripe().paymentIntents.retrieve(payment_intent);

    if(!paymentIntent.metadata.purchaseOrderId) return notFound();
    if(!paymentIntent.metadata.invoiceId) return notFound();
    // if(paymentIntent.metadata.purchaseOrderId){
      console.log(paymentIntent, 'intent');
    // }
    const isSuccess = paymentIntent.status === 'succeeded';
    // const isSuccess = false;

    if(isSuccess){
      console.log('logged success!!!!!!');
      
      const invoiceId = paymentIntent.metadata.invoiceId;
      const invoiceNumber = paymentIntent.metadata.invoiceNumber;
      const name = paymentIntent.metadata.name;
      const email = paymentIntent.metadata.email;
      const company = paymentIntent.metadata.company;

        if (!invoiceId) notFound();

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

        const resend = getResend(); 
        await resend.emails.send({
          from: `Support <${process.env.SENDER_EMAIL}>`,
          to: email,
          subject: "Order Confirmation",
          react: PayReceiptEmail({id: invoiceNumber, company:'Aspen Groups', name, email, createdAt: paymentIntent.created*1000, pricePaidInCents: paymentIntent.amount }),
        })
    }
    // console.log(paymentIntent, 'Payment Session');
    // console.log(paymentIntent.metadata, 'metadata Session');
    
  return (
    <div>
      <h1 className="text-4xl font-bold">
        {isSuccess ? 'Success!': 'Error!'}
      </h1>
      <Button className='mt-4' size={'lg'} asChild>
        {isSuccess ? (
          <div className="text-xl">Your Invoice is Paid</div>
        ): (
          <>
            <div className="text-xl">Something went wrong!!</div>
            <Link href={`/pay/${paymentIntent.metadata.invoiceId}/payment`}>Try again</Link>
          </>
        )}
      </Button>
    </div>
  )
}