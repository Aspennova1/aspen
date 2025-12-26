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
import { CreateInternalRfqType } from "@/utils/types";
import { FormModalContainer } from "../form/FormContainer";
import { createInternalRFQ } from "@/utils/actions";
import FormInput from "../form/FormInput";
import TextAreaInput from "../form/TextAreaInput";
import { Attachments } from "../form/ImageInput";
import { SubmitButton } from "../form/Buttons";

type Props = {
  open: boolean;
  onClose: () => void;
  rfqId: string;
  rfqName: string;
  customerName: string;
  customerEmail: string;
  rfqListId: string
};

export function CreateInternalRfqModal({
  rfqListId,
  open,
  onClose,
  rfqId,
  rfqName,
  customerName,
  customerEmail,
}: Props) {
  const defaultValues: CreateInternalRfqType = {
    rfqListId,
      rfqTitle: `RFQ - Request #${rfqName}`,
      rfqDescription: ''
    };
  
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create internal RFQ for request #{rfqId}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Customer:{" "}
            <span className="font-medium text-foreground">
              {customerName} ({customerEmail})
            </span>
          </DialogDescription>
        </DialogHeader>

    <FormModalContainer action={createInternalRFQ} onSuccess={()=> onClose()}>
      <div className="space-y-4">
        <input type="hidden" name="rfqListId" value={rfqListId} />
        <FormInput
            name="rfqTitle"
            type="text"
            label="Rfq title"
            defaultValue={defaultValues.rfqTitle}
          />

          {/* Description */}
          <TextAreaInput
            name="rfqDescription"
            labelText="Rfq Description"
            defaultValue={defaultValues.rfqDescription}
          />
          <Attachments />
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {/* Submit */}
          <SubmitButton size="default" text="Create Internal RFQ" />
        </DialogFooter>
      </div>
    </FormModalContainer>
    {/* <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CustomFormFieldPlaceholder value="Rfq Title" name="rfqTitle" placeholder="Title" control={form.control} />
        <CustomFormTextArea name="rfqDescription" value="Rfq Description" placeholder="Brief description.." control={form.control} />

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            Create RFQ
          </Button>
        </DialogFooter>
      </form>
    </Form> */}

        {/* Form */}
        {/* <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">RFQ title</label>
            <CustomFormFieldPlaceholder name="email" placeholder="Enter your email" control={form.control} />            
            <Input
              value={rfqTitle}
              onChange={(e) => setRfqTitle(e.target.value)}
              placeholder="Enter RFQ title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              RFQ description (what vendors will see)
            </label>
            <Textarea
              rows={4}
              value={rfqDescription}
              onChange={(e) => setRfqDescription(e.target.value)}
              placeholder="Enter description for vendors"
            />
          </div>
        </div> */}

        
      </DialogContent>
    </Dialog>
  );
}
