"use client";

import { useState } from "react";
import { VendorRFQ } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubmitQuoteModal } from "@/components/vendor/SubmitQuoteModal";
import { Paperclip } from "lucide-react";
import { Label } from "../ui/label";

export default function VendorRfqCard({ rfq }: { rfq: VendorRFQ }) {
  
  const [open, setOpen] = useState(false);

  console.log(rfq, 'rfqdetails');
  

  return (
    <div className="rounded-xl border p-5 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Company</p>
          <p className="font-semibold">{rfq.company}</p>
        </div>

        <div className="flex gap-2">
          <StatusBadge status={rfq.status} />
          <StatusBadge status={rfq.latestQuoteStatus} />
        </div>
      </div>

      {/* RFQ Info */}
      <div className="space-y-2">
        <p className="text-lg font-medium">{rfq.subject}</p>
        <p className="text-sm text-muted-foreground">{rfq.description}</p>
      </div>

      {/* Attachments */}
      {rfq.attachments?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Paperclip size={16} />Project Attachments
          </p>

          {rfq.attachments.map((file) => (
            <a
              key={file.Id}
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline block"
            >
              {file.fileName}
            </a>
          ))}
        </div>
      )}

      {rfq.latestQuoteAmount && (
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Label>Latest Quote Amount {`${rfq.latestQuoteAmount} USD`}</Label>
          </p>
        </div>        
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Assigned on {new Date(rfq.assignedAt).toLocaleDateString()}
        </p>

        <Button size="sm" onClick={() => setOpen(true)}>
          Submit / View Quote
        </Button>
      </div>

      {/* Modal */}
      <SubmitQuoteModal
        open={open}
        onClose={() => setOpen(false)}
        assignmentId={rfq.assignmentId}
        company={rfq.company}
        rfqTitle={rfq.subject}
        rfqDescription={rfq.description}
        latestQuoteAmount={rfq.latestQuoteAmount}
        latestQuoteStatus = {rfq.latestQuoteStatus}
        // previousQuotes={rfq.previousQuotes}
        quoteAttachments={rfq.quoteAttachments}
      />
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  if (status === "NEW") {
    return <Badge variant="secondary">New</Badge>;
  }

  if (status === "Mark in Progress") {
    return <Badge variant="secondary">In progress</Badge>;
  }

  if (status === "Accepted") {
    return (
      <Badge className="bg-green-100 text-green-800">
        Accepted
      </Badge>
    );
  }

  if (status === "Rejected") {
    return (
      <Badge className="bg-red-100 text-red-800">
        Rejected
      </Badge>
    );
  }

  if (status === "SUBMITTED") {
    return (
      <Badge className="bg-green-100 text-green-800">
        Submitted
      </Badge>
    );
  }

  if (status === "CANCELLED") {
    return (
      <Badge className="bg-red-100 text-red-800">
        Cancelled
      </Badge>
    );
  }

  return <Badge variant="outline">{status}</Badge>;
}
