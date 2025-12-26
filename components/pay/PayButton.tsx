'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Props = {
  purchaseOrderId: string;
  invoiceId: string;
//   userId: string;

};

export function PayNowButton({ purchaseOrderId, invoiceId }: Props) {
  const router = useRouter();

  const handlePay = () => {
    router.push(`/pay/${invoiceId}/payment`);
  };

  return (
    <Button
      className="bg-green-600 hover:bg-green-700"
      onClick={handlePay}
    >
      Pay Now
    </Button>
  );
}
