'use server'

import Link from 'next/link';
import { Button } from '../../../../components/ui/button';
import { decideCustomerQuoteAction, deleteAttachmentAction, deleteRFQAction, getMyRFQsAction, uploadRFQAttachmentAction } from '@/utils/actions';
import FormContainer from '@/components/form/FormContainer';
import { IconButton, SubmitButton } from '@/components/form/Buttons';
import { Paperclip } from 'lucide-react';


type CustomerQuote = {
  id: string;
  price: number;
  currency: string;
  notes?: string;
  status: "NEW" | "SENT" | "ACCEPTED" | "REJECTED";
  sentAt?: string;
};


export default async function getMyRFQs(){
  const rfqs =  await getMyRFQsAction();

  if (!rfqs.length) {
    return <p className="text-muted-foreground">No RFQs found.</p>;
  }

  return (
  <div className="p-0">
    <h2 className="text-4xl font-semibold mb-6">My RFQs</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rfqs.map((rfq) => {
        const quote = rfq.customerQuote;

        const canRespond =
          quote && quote.status === "SENT";

        const isFinalized =
          quote &&
          (quote.status === "ACCEPTED" || quote.status === "REJECTED");

        return (
          <div
            key={rfq.Id}
            className="p-4 border rounded-2xl space-y-4"
          >
            {/* RFQ Info */}
            <div className="space-y-1">
              <p className="font-semibold text-lg capitalize">
                {rfq.projectType}
              </p>
              <p className="text-sm">Company: {rfq.company}</p>
              <p className="text-sm text-muted-foreground">
                Email: {rfq.email}
              </p>
              <p className="text-sm">
                Budget: {rfq.budgetRange || "-"}
              </p>
              <p className="text-sm">
                Timeline: {rfq.timeline || "-"}
              </p>
              <p className="text-sm">
                Description: {rfq.briefDescription}
              </p>
            </div>
            {rfq.attachments?.length > 0 && (
              <ul className="mt-2 space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                    <Paperclip size={16} />Your Attachments
                  </p>
                {rfq.attachments.map((att) => (
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

                    {rfq.isEditable && !quote && (
                      <FormContainer action={deleteAttachmentAction}>
                        <input type="hidden" name="attachmentId" value={att.Id} />
                        <IconButton actionType='delete' />
                      </FormContainer>
                    )}
                    {/* ❌ delete */}
                    {/* <DeleteAttachmentButton attachmentId={att.Id} /> */}
                  </li>
                ))}
              </ul>
            )}
            {/* Customer Quote Section */}
            {!quote && (
              <p className="text-sm text-muted-foreground">
                Waiting for quote from project manager
              </p>
            )}

            {quote && (
              <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
                <p className="font-medium">
                  Quoted Price:{" "}
                  <span className="font-semibold">
                    {quote.price} {`USD`}
                  </span>
                </p>

                {quote.notes && (
                  <p className="text-sm text-muted-foreground">
                    Notes: {quote.notes}
                  </p>
                )}

                {/* Status */}
                {isFinalized && (
                  <p
                    className={`text-sm font-medium ${
                      quote.status === "ACCEPTED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {quote.status}
                  </p>
                )}

                {(rfq.customerQuote?.attachments) && rfq.customerQuote?.attachments?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Paperclip size={16} />Project manager quote Attachments
                  </p>

                  {rfq.customerQuote.attachments.map((file) => (
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

                {/* Actions */}
                {canRespond && (
                  <div className="flex gap-3 pt-2">
                    <FormContainer action={decideCustomerQuoteAction}>
                         <input type="hidden" name="quoteId" value={quote.id} />
                          <input type="hidden" name="decision" value="ACCEPTED" />
                          <SubmitButton className="bg-green-600 hover:bg-green-700" size='sm' text='Accept' />
                    </FormContainer>

                    <FormContainer action={decideCustomerQuoteAction}>
                         <input type="hidden" name="quoteId" value={quote.id} />
                          <input type="hidden" name="decision" value="REJECTED" />
                          <SubmitButton className="bg-red-600 hover:bg-red-700" size='sm' text='Reject' />
                    </FormContainer>
                  </div>
                )}
              </div>
            )}

            {/* Edit RFQ (only if editable AND no quote yet) */}
            {rfq.isEditable && !quote && (
              <div className="flex gap-2 items-center">
    {/* Edit RFQ */}
    <Link href={`/rfqs/${rfq.Id}/edit`}>
      <Button size="sm">Edit RFQ</Button>
    </Link>
    <FormContainer action={deleteRFQAction}>
      <input type="hidden" name="rfqId" value={rfq.Id} />
        <SubmitButton size='sm' text='Delete RFQ' className='bg-red-500' />
    </FormContainer> 

    {/* Upload Attachment */}
    {/* <FormContainer action={uploadRFQAttachmentAction}>
      <input type="hidden" name="rfqId" value={rfq.Id} />

      <Input id={`upload-${rfq.Id}`} className='sr-only' name={'attachments'} type='file' multiple accept='application/pdf' />

      <label htmlFor={`upload-${rfq.Id}`}>
        <Button size="sm" variant="outline" type="submit">
          Upload more Attachments
        </Button>
      </label>
    </FormContainer> */}
  </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

}

// export default page