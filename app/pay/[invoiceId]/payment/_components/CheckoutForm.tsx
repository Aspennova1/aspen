'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { InvoiceWithPurchaseOrderRFQ } from '@/utils/types';
import {Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
type CheckouFormProps = {
    invoice: InvoiceWithPurchaseOrderRFQ;
    clientSecret: string | undefined;
    error?: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutForm = ({invoice, clientSecret, error}: CheckouFormProps) => {
console.log(clientSecret, 'secrettt');
try{
    useEffect(() => {
      if (error) toast.error(error);
    }, [error]);
  
    if (error) {
      return (
        <div className="max-w-xl mx-auto mt-24 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Payment unavailable</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
  
          {/* 🧾 Invoice Summary — LEFT (SMALL) */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6 space-y-6 h-fit">
  
            {/* Amount */}
            <div>
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {formatCurrency(invoice.amount/100)}
              </p>
            </div>
  
            <hr />
  
            {/* Title */}
            <h1 className="text-lg font-semibold">
              {invoice.description || 'Invoice Payment'}
            </h1>
  
            {/* Customer Info */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium text-right">
                  {invoice.purchaseOrder?.rfqList.rfq.company}
                </span>
              </div>
  
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact</span>
                <span className="font-medium text-right">
                  {invoice.purchaseOrder?.rfqList.rfq.name}
                </span>
              </div>
  
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-right break-all">
                  {invoice.purchaseOrder?.rfqList.rfq.email}
                </span>
              </div>
            </div>
          </div>
  
          {/* 💳 Payment Details — RIGHT (LARGE) */}
          <div className="lg:col-span-3 bg-white rounded-xl border shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6">
              Payment Details
            </h2>
  
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <Form priceinCents={invoice.amount} email={invoice.purchaseOrder?.rfqList.rfq.email} />
            </Elements>
  
            <p className="text-xs text-muted-foreground mt-6">
              🔒 Secure payment powered by Stripe
            </p>
          </div>
  
        </div>
      </div>
    )
  }
  catch(err){
    console.log(err, 'First payment errorrrrrrrr!!!!!!!');
  }

}

function Form({priceinCents, email}: {priceinCents: number, email: string | undefined}) {
  try{
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [emailId, setEmail] = useState<string | undefined>(email);
  
    function handleSubmit(e: FormEvent){
      
      e.preventDefault();
      if (!stripe || !elements || emailId == null) return
  
      setIsLoading(true);
  
      stripe.confirmPayment({elements, confirmParams:{
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/payment-success`
      }}).then(({error})=>{
        if(error.type === 'card_error' || error.type === 'validation_error'){
          setErrorMessage(error.message)
        }
        else{
          setErrorMessage('An unknown error occured')
        }
      }).finally(()=> setIsLoading(false))
      // const { error } = await stripe.confirmPayment({
      //   elements,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/payment/success`,
      //   },
      // })
  
      // if (error) {
      //   console.error(error.message)
      // }
    }
  
    return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className='text-destructive'>{errorMessage}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <LinkAuthenticationElement onChange={e=> setEmail(e.value.email)} />
        </CardContent>
        <CardFooter>
          <Button className='w-full' size={'lg'} disabled={stripe == null || elements == null || isLoading}>
            {isLoading ? 'Paying...' : `Pay - ${formatCurrency(priceinCents/100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
    )
  }
  catch(err){
    console.log(err, 'Payment Errorrr!!!!!!!!!');
    
  }
}

export default CheckoutForm