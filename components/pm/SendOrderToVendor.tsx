"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import TextAreaInput from "../form/TextAreaInput";
import { SubmitButton } from "@/components/form/Buttons";
import { FormModalContainer } from "@/components/form/FormContainer";
import { sendOrderToVendorAction } from "@/utils/actions";
import { Attachments } from "../form/ImageInput";

type Props = {
  open: boolean;
  onClose: () => void;
  purchaseOrderId: string;
};

export function SendOrderToVendorModal({
  open,
  onClose,
  purchaseOrderId,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Order to Vendor</DialogTitle>
        </DialogHeader>

        <FormModalContainer
          action={sendOrderToVendorAction}
          onSuccess={()=> onClose()}
        >
          <input
            type="hidden"
            name="purchaseOrderId"
            value={purchaseOrderId}
          />

          <TextAreaInput
            name="description"
            labelText="Order description (optional)"
          />

          <Attachments />

          <DialogFooter className="pt-4">
            <SubmitButton text="Send Order" />
          </DialogFooter>
        </FormModalContainer>
      </DialogContent>
    </Dialog>
  );
}
