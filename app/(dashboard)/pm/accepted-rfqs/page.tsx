import { getPmAcceptedRFQsAction } from "@/utils/actions";
import PMAcceptedRfqCard from "@/components/pm/AcceptedRfqCard";

export default async function PMAcceptedRFQsPage() {
  const rfqs = await getPmAcceptedRFQsAction();

  // console.log(rfqs, 'edrfff');
  

  if (!rfqs || rfqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="text-5xl">📄</div>
        <h2 className="text-2xl font-semibold">No RFQs yet</h2>
        <p className="text-muted-foreground max-w-md">
          No Accepted RFQs yet, theywill appear here once they are accepted.  
          You’ll be able to send orders, invoices, and manage from this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Accepted RFQs
        </h1>
        <p className="text-sm text-muted-foreground">
          RFQs where customers accepted your quote and are awaiting order processing.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {rfqs.map((rfq) => (
          <PMAcceptedRfqCard key={rfq.rfqListId} rfq={rfq}
          />
        ))}
      </div>
    </div>
  );
}
