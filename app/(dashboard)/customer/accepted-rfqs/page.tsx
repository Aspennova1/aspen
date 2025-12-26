import { getCustomerAcceptedRFQsAction } from "@/utils/actions";
import CustomerAcceptedRfqCard from "@/components/customer/CustomerAcceptedRfqCard";
import { Resend } from "resend";
import PayReceiptEmail from "@/components/email/PayReceiptEmail";
import { Button } from "@/components/ui/button";

const resend = new Resend('re_5zhV2EqZ_crsiRRqUgKUJvquFxUsswZS6');

export default async function CustomerAcceptedRFQsPage() {
  const rfqs = await getCustomerAcceptedRFQsAction();

  if (rfqs.length === 0) {
    return (
      <p className="text-muted-foreground">
        No accepted RFQs yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          Accepted RFQs
        </h1>
        <p className="text-sm text-muted-foreground">
          RFQs where you have accepted the project manager quote.
        </p>
      </div>

      {/* Cards */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rfqs.map((rfq) => (
          <CustomerAcceptedRfqCard
            key={rfq.rfqListId}
            rfq={rfq}
          />
        ))}
      </div> */}

       <div className="flex flex-col gap-6">
        {rfqs.map((rfq) => (
          <CustomerAcceptedRfqCard
            key={rfq.rfqListId}
            rfq={rfq}
          />
        ))}
      </div>
    </div>
  );
}
