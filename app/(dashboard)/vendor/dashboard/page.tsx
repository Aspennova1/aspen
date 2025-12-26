"use server";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubmitQuoteModal } from "@/components/vendor/SubmitQuoteModal";
import { VendorRFQ } from "@/utils/types";
import { Paperclip } from "lucide-react";
import { getVendorRFQsAction } from "@/utils/actions";
import VendorRfqCard from "@/components/vendor/VendorRFQCard";

export default async function VendorDashboardPage() {
  const vendorRfqsData = await getVendorRFQsAction(); // ✅ server action

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Vendor RFQs</h1>
        <p className="text-sm text-muted-foreground">
          RFQs assigned to you by Aspen. Review details, attachments, and submit quotes.
        </p>
      </div>

      {/* Cards */}
      {vendorRfqsData.length === 0 && (
        <p className="text-muted-foreground">No RFQs assigned.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendorRfqsData.map((rfq) => (
          <VendorRfqCard key={rfq.assignmentId} rfq={rfq} />
        ))}
      </div>
    </div>
  );
}