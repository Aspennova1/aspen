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
import { actionFunctionModal, FormModalContainer } from "@/components/form/FormContainer";
import { sendOrderToVendorAction } from "@/utils/actions";
import { Attachments } from "../form/ImageInput";

type Props = {
  title: string,
  description: string,
  submitText: string,
  open: boolean;
  onClose: () => void;
  purchaseOrderId: string;
  action: actionFunctionModal;
};

export function GenericSendOrderModal({
  title,
  open,
  onClose,
  purchaseOrderId,
  action,
  description,
  submitText
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <FormModalContainer
          action={action}
          onSuccess={()=> onClose()}
        >
          <input
            type="hidden"
            name="purchaseOrderId"
            value={purchaseOrderId}
          />

          <TextAreaInput
            name="description"
            labelText ={description +" (optional)"}
          />

          <Attachments />

          <DialogFooter className="pt-4">
            <SubmitButton text={submitText} />
          </DialogFooter>
        </FormModalContainer>
      </DialogContent>
    </Dialog>
  );
}
