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
import TextAreaInput from "@/components/form/TextAreaInput";
import { Attachments } from "@/components/form/ImageInput";
import { uploadPurchaseOrderAction } from "@/utils/actions";
// import { uploadPurchaseOrderAction } from "@/utils/actions";

type Props = {
  open: boolean;
  onClose: () => void;
  rfqListId: string;
  customerQuoteId: string;
};

export function UploadPurchaseOrderModal({
  open,
  onClose,
  rfqListId,
  customerQuoteId,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Purchase Order
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Upload your official purchase order for this RFQ.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Server Action Form */}
        <FormModalContainer
          action={uploadPurchaseOrderAction}
          onSuccess={() => onClose()}
        >
          <input type="hidden" name="rfqListId" value={rfqListId} />
          <input
            type="hidden"
            name="customerQuoteId"
            value={customerQuoteId}
          />

          <div className="space-y-4">
            {/* Optional description */}
            <TextAreaInput
              name="description"
              labelText="Order notes (optional)"
              placeholder="Add any reference or instructions for this order..."
            />

            {/* Attachments */}
            <Attachments />

            <DialogFooter className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>

              <SubmitButton
                size="default"
                text="Submit Purchase Order"
              />
            </DialogFooter>
          </div>
        </FormModalContainer>
      </DialogContent>
    </Dialog>
  );
}
