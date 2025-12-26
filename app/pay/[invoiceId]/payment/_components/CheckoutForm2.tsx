'use client'

import { formatCurrency } from '@/lib/formatters';
import {Elements, EmbeddedCheckout, EmbeddedCheckoutProvider, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';
type CheckouFormProps = {
    invoice: object;
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutForm2 = ({invoiceId}: any) => {

  console.log(invoiceId, 'from payment');
  
  const fetchClientSecret = useCallback(async()=>{
      const res = await fetch('/api/stripe/payment', { method: 'POST', body: JSON.stringify({invoiceId}), credentials: 'include' });

     const data = await res.json();

      
      if (!res.ok) {
        throw new Error(data.error || "Payment failed");
      }
  // 🔑 clientSecret received
  console.log("Client Secret:", data.clientSecret);

  return data.clientSecret;

  // 👉 Navigate to payment page
  // router.push(`/pay/${invoiceId}`);
  }, []);

  const options = {fetchClientSecret};
  
  return(
  <div className="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout/>
      </EmbeddedCheckoutProvider>
    </div>
  );
}

function Form(){
  const stripe = useStripe()
  const elements = useElements()
  return <PaymentElement />
}

export default CheckoutForm2