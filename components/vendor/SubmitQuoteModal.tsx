"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import FormContainer, { FormModalContainer } from "@/components/form/FormContainer";
import { deleteVendorAttachmentAction, submitVendorQuoteAction } from "@/utils/actions";

import { IconButton, SubmitButton } from "@/components/form/Buttons";
import FormInput from "../form/FormInput";
import { Attachments } from "../form/ImageInput";
import TextAreaInput from "../form/TextAreaInput";
import { Attachment } from "@prisma/client";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
  assignmentId: string;
  company: string;
  rfqTitle: string;
  rfqDescription: string;
  latestQuoteAmount: number | null;
  latestQuoteStatus: string;
  // previousQuotes: number[];
  quoteAttachments: {
    Id: string;
    fileName: string;
    fileUrl: string;
    createdAt: Date;
  }[];
};

export function SubmitQuoteModal({
  open,
  onClose,
  assignmentId,
  company,
  rfqTitle,
  rfqDescription,
  // previousQuotes,
  latestQuoteAmount,
  latestQuoteStatus,
  quoteAttachments 
}: Props) {
  const hasAttachments = quoteAttachments && quoteAttachments.length > 0;

  const hasQuote = latestQuoteAmount !== null && latestQuoteAmount !== undefined;

  const showSection = hasAttachments || hasQuote;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit quote</DialogTitle>
          <DialogDescription className="text-sm">
            Assignment #{assignmentId} · {company}
          </DialogDescription>
          <p className="text-sm text-muted-foreground">{rfqTitle}</p>
        </DialogHeader>

        {/* Scope */}
        <div className="rounded border p-3 text-sm bg-muted">
          <p className="font-medium mb-1">
            Scope / requirements from Aspen
          </p>
          <p>{rfqDescription}</p>
        </div>
            {showSection && (
              <ul className="mt-2 space-y-1">
                <div className="flex justify-between gap-2 text-sm">
                  {hasAttachments && (
                  <div>
                      <p className="font-medium mb-1">
                        Your attchments
                      </p>
                    
                    {quoteAttachments.map((att) => (
                      <li
                        key={att.Id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Link
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 break-all whitespace-normal underline max-w[80%]"
                        >
                          {att.fileName}
                        </Link>

                        {latestQuoteStatus !== 'Accepted' && (
                          <FormContainer action={deleteVendorAttachmentAction}>
                            <input type="hidden" name="attachmentId" value={att.Id} />
                            <IconButton actionType='delete' />
                          </FormContainer>
                        )}
                        {/* <DeleteAttachmentButton attachmentId={att.Id} /> */}
                      </li>
                    ))}
                  </div>
                  )}
                  <div>
                    {hasQuote && (
                    <div className="text-sm">
                      <p className="font-medium mb-1">Your previous quote</p>
                      {`${latestQuoteAmount} USD`}
                      {/* {previousQuotes.map((q, i) => (
                        <p key={i}>{q} USD</p>
                      ))} */}
                    </div>
                  )}
                  </div>
                </div>
              </ul>
            )}
        {/* ✅ Server Action Form */}
        {latestQuoteStatus !== 'Accepted' && (
        <FormModalContainer action={submitVendorQuoteAction} onSuccess={()=> onClose()}>
          <div className="space-y-4 mt-4">
            <input
              type="hidden"
              name="rfqVendorAssignmentId"
              value={assignmentId}
            />

            <FormInput
              name="amount"
              label="Quote amount (USD)"
              placeholder="Enter amount"
              defaultValue={String(latestQuoteAmount) || 'Enter amount'}
              type="number"
            />

            <FormInput
              type="date"
              required={false}
              name="validUntil"
            />
          <Attachments />

            <TextAreaInput
              name="notes"
              labelText="Notes (optional)"
            />

            <DialogFooter className="pt-2">
              <SubmitButton size="default" text="Submit quote" />
            </DialogFooter>
          </div>
        </FormModalContainer>
        )}
        {latestQuoteStatus == 'Accepted' && (
          <p className="font-medium mb-1">
            Your quote is accepted and you cannot make changes.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
