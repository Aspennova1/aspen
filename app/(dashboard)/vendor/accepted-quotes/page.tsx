import VendorAcceptedQuoteCard from '@/components/vendor/VendorAcceptedQuoteCard';
import { getVendorAcceptedQuotesAction } from '@/utils/actions';

export default async function VendorAcceptedQuotes() {
  const vendorquotesData = await getVendorAcceptedQuotesAction(); // ✅ server action
  // console.log(vendorquotesData,'vendor quotes data22');
  
   if (vendorquotesData.length === 0) {
      return (
        <p className="text-muted-foreground">
          No accepted Quotes yet.
        </p>
      );
    }
  
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">
            Accepted Quotes
          </h1>
          <p className="text-sm text-muted-foreground">
            change.. RFQs where customers accepted your quote and are awaiting order processing.
          </p>
        </div>
  
        <div className="flex flex-col gap-6">
          {vendorquotesData.map((quote) => (
            <VendorAcceptedQuoteCard key={quote.rfqListId} quote={quote}
            />
          ))}
        </div>
      </div>
    );
}
