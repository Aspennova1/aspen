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
import { FormModalContainer } from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";
import FormInput from "../form/FormInput";
import TextAreaInput from "../form/TextAreaInput";
import { createCustomerQuoteRFQ } from "@/utils/actions";
import { Attachments } from "../form/ImageInput";

type Props = {
  open: boolean;
  onClose: () => void;

  customerRfqId: string;
  rfqListId: string;

  customerName: string;
  customerEmail: string;
};

export function PrepareCustomerQuoteModal({
  open,
  onClose,
  customerRfqId,
  rfqListId,
  customerName,
  customerEmail,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Prepare customer quote – Request #{rfqListId}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            {customerName} ({customerEmail})
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Server Action Form (same pattern as Internal RFQ modal) */}
        <FormModalContainer
          action={createCustomerQuoteRFQ}
          onSuccess={()=>onClose()}
        >
          <div className="space-y-4 mt-4">
            {/* 🔑 Hidden fields */}
            <input
              type="hidden"
              name="customerRfqId"
              value={customerRfqId}
            />
            <input
              type="hidden"
              name="rfqListId"
              value={rfqListId}
            />

            {/* Sell price */}
            <FormInput
              name="sellPrice"
              label="Sell price to customer"
              placeholder="Enter sell price"
              type="number"
            />

            <Attachments />
            {/* Notes */}
            <TextAreaInput
              name="notes"
              labelText="Notes to customer"
              placeholder="Add notes for the customer (optional)"
            />
            <DialogFooter className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={()=> onClose()}>
                Cancel
              </Button>

              <SubmitButton
                text="Send quote"
                className="bg-green-600 hover:bg-green-700"
              />
            </DialogFooter>
          </div>
        </FormModalContainer>
      </DialogContent>
    </Dialog>
  );
}
