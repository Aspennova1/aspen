"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormModalContainer } from "../form/FormContainer";
import { updateVendorQuoteStatusAction } from "@/utils/actions";
import { CanDisableButton, SubmitButton } from "../form/Buttons";

export type VendorQuoteForPM = {
  assignmentId: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  notes?: string;
  submittedAt: string;
  quoteId: string;
  statusCode: string;
  attachments:{
    Id: string,
    fileName: string,
    fileUrl: string,
    createdAt: string,
  }[]
//   status: {
//   code : string,
//   label: string
// };
};

type Props = {
  open: boolean;
  onClose: () => void;

  rfqId: string;
  customerName: string;
  customerEmail: string;
  rfqListId: string;
  // quotes: VendorQuoteForPM[];
};

  export function ViewVendorQuotesModal({
    open,
    onClose,
    rfqId,
    rfqListId,
    customerName,
    customerEmail,
  }: Props) {
    
    const router = useRouter();
    const [quotes, setQuotes] = useState<VendorQuoteForPM[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingQuoteId, setUpdatingQuoteId] = useState<string | null>(null);
    
    async function fetchQuotes() {
      try {
        setUpdatingQuoteId(null);
        setQuotes([]);
        setLoading(true);
        const res = await fetch(
          `/api/pm/rfq-list/${rfqListId}/quotes`
        );

        const data = await res.json();
        setQuotes(data.quotes ?? []);
      } catch (err) {
        console.error('Failed to fetch quotes', err);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
      if (!open) return;
      fetchQuotes();
    }, [open, rfqListId]);
  
    const hasAcceptedQuote = quotes.some(
    (q) => q.statusCode === "ACCEPTED"
    );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Vendor quotes for RFQ #{rfqListId}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Request #{rfqId} – for{" "}
            <span className="font-medium text-foreground">
              {customerName} ({customerEmail})
            </span>
          </DialogDescription>

          <p className="text-sm mt-1 text-muted-foreground">
            Compare vendor quotes side-by-side. Accept exactly one final vendor;
            all other vendors will be rejected.
          </p>
        </DialogHeader>

        {loading && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading vendor quotes…
                </p>
              </div>
            )}
            {!loading && quotes.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No vendor quotes have been submitted yet.
                </p>
              </div>
            )}
        {/* Quotes list */}
        <div className="space-y-6 mt-4">
          {quotes.map((q) => { 
            //const isFinalized = hasAcceptedQuote || q.statusCode === "ACCEPTED" || q.statusCode === "REJECTED";

            // const isUpdating = ;

            // const disableActions = isFinalized || loading;
            const disableActions = loading;

            return (
            <div
              key={q.assignmentId}
              className="rounded-lg border p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{q.vendorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {q.vendorEmail}
                  </p>
                </div>

                <StatusBadge status={q.statusCode} />
                  
                {/* </Badge> */}
              </div>

              {/* Amount */}
              <div>
                <p className="text-sm text-muted-foreground">
                  Quote amount
                </p>
                <p className="font-medium">{q.amount} USD</p>
              </div>

              {/* Notes */}
              {q.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-sm">{q.notes}</p>
                </div>
              )}

              {/* quotes attachments */}
              {q.attachments?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Paperclip size={16} />Quote Attachments
                  </p>

                  {q.attachments.map((file) => (
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

              {/* Submitted at */}
              <p className="text-xs text-muted-foreground">
                Submitted at {new Date(q.submittedAt).toLocaleString()}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                {/* <Button variant="outline" size="sm" disabled={disableActions} onClick={() => updateQuoteStatus(q.quoteId, "MARK_IN_PROGRESS")}>
                  Mark In Progress
                </Button> */}

                <FormModalContainer
                  action={updateVendorQuoteStatusAction}
                  onSuccess={() => fetchQuotes()}
                >
                  <input type="hidden" name="quoteId" value={q.quoteId} />
                  <input type="hidden" name="status" value="MARK_IN_PROGRESS" />

                  <CanDisableButton
                    text="Mark In Progress"
                    className="bg-yellow-600 hover:bg-yellow-700"
                    size="sm"
                    disable={disableActions}
                  />
                </FormModalContainer>

                <FormModalContainer
                    action={updateVendorQuoteStatusAction}
                    onSuccess={() => fetchQuotes()}
                  >
                    <input type="hidden" name="quoteId" value={q.quoteId} />
                    <input type="hidden" name="status" value="REJECTED" />

                    <CanDisableButton
                      size="sm"
                      text="Reject"
                      className="bg-red-600 hover:bg-red-700"
                      disable={disableActions}
                    />
                  </FormModalContainer>

                <FormModalContainer
                    action={updateVendorQuoteStatusAction}
                    onSuccess={() => fetchQuotes()}
                  >
                    <input type="hidden" name="quoteId" value={q.quoteId} />
                    <input type="hidden" name="status" value="ACCEPTED" />

                    <CanDisableButton
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                      text="Accept as final vendor"
                      disable={disableActions}
                    />
                  </FormModalContainer>
              </div>
            </div>
          )})}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function StatusBadge({ status }: { status: string }) {
  if (status === "NEW") {
    return <Badge variant="secondary">New</Badge>;
  }

  if (status === "MARK_IN_PROGRESS") {
    return <Badge variant="secondary">In progress</Badge>;
  }

  if (status === "ACCEPTED") {
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
  }

  if (status === "REJECTED") {
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
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
        Cencelled
      </Badge>
    );
  }
  // if (status === "MARKED_FOR_REVIEW") {
  //   return (
  //     <Badge className="bg-red-100 text-yellow-800">
  //       Rejected
  //     </Badge>
  //   );
  // }

  return <Badge variant="outline">{status}</Badge>;
}
