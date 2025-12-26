'use client';

import Link from 'next/link';
import { Paperclip } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VendorAcceptedQuote } from '@/utils/types'; // adjust path if needed
import { GenericSendOrderModal } from '../pm/GenericSendOrderModal';
import { sendInvoiceToPMAction, sendOrderToPMAction } from '@/utils/actions';
import { useState } from 'react';
import { GenericSendInvoiceModal } from '../pm/GenericSendInvoiceModal';

type Props = {
  quote: VendorAcceptedQuote;
};

export default function VendorAcceptedQuoteCard({ quote }: Props) {
    const [openSignedOrderModal, setOpenSignedOrderModal] = useState(false);
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

    // const hasPO = !!quote.purchaseOrder;
    // let label = quote.purchaseOrder?.orderStatus;
    
    // // if(quote.purchaseOrder?.orderStatus == 'Order sent to Vendor'){
    // //     label = 'Order received -> Uplaod signed order'
    // // }
    // // if(quote.purchaseOrder?.orderCode == 'VENDOR_SIGNED'){
    // //     label = 'Awaiting upload Invoice'
    // // }
    // if(quote.purchaseOrder?.orderCode == 'SENT_TO_VENDOR'){
    //     label = 'Order received -> Uplaod signed order'
    // }
    // if(quote.purchaseOrder?.orderCode == 'ORDER_SUBMITTED'){
    //     label = 'In progress'
    // }
    // if(quote.purchaseOrder?.orderCode == 'VENDOR_SIGNED'){
    //     label = 'Awaiting upload Invoice'
    // }
    // if(quote.purchaseOrder?.orderCode == 'ORDER_SIGNED_BY_PM'){
    //     label = 'Upload Invoice'
    // }


    const po = quote.purchaseOrder ?? null;

    const orderAttachments = po?.orderAttachments ?? [];
    const signedOrderAttachments = po?.signedOrderAttachments ?? [];
    const vendorInvoices = po?.vendorInvoices ?? [];

    const hasPurchaseOrder = !!po;

    const hasOrderFromPM = orderAttachments.length > 0;
    const hasSignedOrderFromVendor = signedOrderAttachments.length > 0;
    const hasInvoice = vendorInvoices.length > 0;


    console.log(hasSignedOrderFromVendor, 'signedvendororder');
    

    let label = 'Awaiting Purchase Order';

    if (hasOrderFromPM && !hasSignedOrderFromVendor) {
      label = 'Order received → Upload signed order';
    } else if (hasSignedOrderFromVendor && !hasInvoice) {
      label = 'Signed order sent → Upload invoice';
    } else if (hasInvoice) {
      label = 'Invoice submitted';
    }


  return (
    <div className="w-full rounded-xl border bg-background p-6">
      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">

        {/* ================= LEFT : RFQ + VENDOR QUOTE ================= */}
        <div className="space-y-4">
          {/* Customer RFQ */}
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Customer Company
            </p>
            <p className="font-semibold">{quote.company}</p>
            <p className="text-sm text-muted-foreground">
              {quote.projectType}
            </p>
          </div>

          <div>
            <p className="font-medium">Project Description</p>
            <p className="text-sm text-muted-foreground">
              {quote.briefDescription}
            </p>
          </div>

          {/* Vendor Quote */}
          <div>
            <p className="font-medium">Your Quote</p>
            <p className="text-sm text-muted-foreground">
              {quote.amount} USD
            </p>
            {quote.notes && (
              <p className="text-sm">{quote.notes}</p>
            )}
          </div>

          {/* Vendor Quote Attachments */}
          {quote.quoteAttachments.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <Paperclip size={16} />
                Quote Attachments
              </p>

              <div className="pl-6 space-y-1">
                {quote.quoteAttachments.map((file) => (
                  <Link
                    key={file.Id}
                    href={file.fileUrl}
                    target="_blank"
                    className="block text-sm underline underline-offset-2"
                  >
                    {file.fileName}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT : PURCHASE ORDER ================= */}
        <div className="space-y-6">
          {hasPurchaseOrder ? (
            <>
              <div>
                <p className="font-medium">Purchase Order</p>
                {quote.purchaseOrder!.orderAttachments[0]?.description && (
                  <p className="text-sm text-muted-foreground">
                    Received on{' '}
                    {new Date(
                      quote.purchaseOrder!.orderAttachments[0].createdAt
                    ).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Order Attachments (PM → Vendor) */}
              {quote.purchaseOrder!.orderAttachments.length > 0 && (
                <div className="space-y-1">
                  <p className="font-medium flex items-center gap-2">
                    <Paperclip size={16} />
                    Order Documents
                  </p>

                  {quote.purchaseOrder!.orderAttachments[0]?.description && (
                    <p className="text-xs text-muted-foreground pl-6">
                      {quote.purchaseOrder!.orderAttachments[0].description}
                    </p>
                  )}

                  <div className="pl-6 space-y-1">
                    {quote.purchaseOrder!.orderAttachments.map((file) => (
                      <Link
                        key={file.Id}
                        href={file.fileUrl}
                        target="_blank"
                        className="block text-sm underline underline-offset-2"
                      >
                        {file.fileName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Signed Order Attachments (Vendor → PM) */}
              {quote.purchaseOrder!.signedOrderAttachments.length > 0 && (
                <div className="space-y-1">
                  <p className="font-medium flex items-center gap-2">
                    <Paperclip size={16} />
                    Signed Order
                  </p>

                  {quote.purchaseOrder!.signedOrderAttachments[0]?.description && (
                    <p className="text-xs text-muted-foreground pl-6">
                      {
                        quote.purchaseOrder!
                          .signedOrderAttachments[0].description
                      }
                    </p>
                  )}

                  <div className="pl-6 space-y-1">
                    {quote.purchaseOrder!.signedOrderAttachments.map((file) => (
                      <Link
                        key={file.Id}
                        href={file.fileUrl}
                        target="_blank"
                        className="block text-sm underline underline-offset-2"
                      >
                        {file.fileName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Purchase order not received yet.
            </p>
          )}
        </div>
      </div>

      {/* ================= INVOICES (Vendor → PM) ================= */}
        {quote.purchaseOrder?.vendorInvoices &&
          quote.purchaseOrder.vendorInvoices.length > 0 && (
            <div className="space-y-3">
              <p className="font-medium flex items-center gap-2">
                <Paperclip size={16} />
                Invoices
              </p>

              <div className="pl-6 space-y-4">
                {quote.purchaseOrder.vendorInvoices.map((invoice, index) => (
                  <div
                    key={invoice.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    {/* Invoice meta */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">
                        Invoice {index + 1}
                      </p>

                      <Badge variant="secondary">
                        {invoice.statusCode}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Amount:{' '}
                      <span className="font-medium">
                        {(invoice.amount / 100).toFixed(2)} USD
                      </span>
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Description:{' '}
                      <span className="font-medium">
                        {(invoice.description)}
                      </span>
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Created on{' '}
                      {new Date(invoice.createdAt).toLocaleString()}
                    </p>

                    {/* Invoice attachments */}
                    {invoice.invoiceAttachments.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {invoice.invoiceAttachments.map((file) => (
                          <Link
                            key={file.Id}
                            href={file.fileUrl}
                            target="_blank"
                            className="block text-sm underline underline-offset-2"
                          >
                            {file.fileName}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

      {/* ================= ACTION BAR ================= */}
      <div className="mt-6 border-t pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {hasPurchaseOrder
                ? label
                : 'Awaiting Purchase Order'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!hasPurchaseOrder && (
              <Button disabled>
                Awaiting Purchase order
              </Button>
            )}

            {hasOrderFromPM && !hasSignedOrderFromVendor && (
              <>
                <Button onClick={() => setOpenSignedOrderModal(true)}>
                  Upload Signed Order
                </Button>

                <GenericSendOrderModal
                  action={sendOrderToPMAction}
                  description="Signed order Description"
                  onClose={() => setOpenSignedOrderModal(false)}
                  purchaseOrderId={quote.purchaseOrder!.id}
                  open={openSignedOrderModal}
                  submitText="Send signed order"
                  title="Send signed order"
                />
              </>
            )}

            {/* {quote.purchaseOrder!.signedOrderAttachments?.length > 0 && (
              <>
                <Button onClick={() => setOpenInvoiceModal(true)}>
                  Upload Invoice
                </Button>

            
            <GenericSendOrderModal
                action={sendOrderToPMAction}
                description="Upload Invoice"
                onClose={() => setOpenInvoiceModal(false)}
                purchaseOrderId={quote.purchaseOrder!.id}
                open={openInvoiceModal}
                submitText="Send Invoice"
                title="Send"
                />
                
              </>
            )} */}

            {/* {quote.purchaseOrder!.signedOrderAttachments.length > 0 && (
              <>
                <Button onClick={() => setOpenInvoiceModal(true)}>
                  Upload Invoice
                </Button>

            
            <GenericSendOrderModal
                action={sendOrderToPMAction}
                description="Upload Invoice"
                onClose={() => setOpenInvoiceModal(false)}
                purchaseOrderId={quote.purchaseOrder.id}
                open={openInvoiceModal}
                submitText="Send Invoice"
                title="Send"
                />
              </>
            )} */}

            {quote.purchaseOrder && (quote?.purchaseOrder?.signedOrderAttachments?.length > 0) && (
              <>
                <Button onClick={() => setOpenInvoiceModal(true)}>
                  Upload Invoice
                </Button>
            
            <GenericSendInvoiceModal
                action={sendInvoiceToPMAction}
                description="Invoice Description"
                onClose={() => setOpenInvoiceModal(false)}
                purchaseOrderId={quote.purchaseOrder.id}
                open={openInvoiceModal}
                submitText="Send"
                title="Send Invoice"
                />
              </>
            )}


            {/* {quote.purchaseOrder && (quote.purchaseOrder.orderCode == 'VENDOR_SIGNED' || quote.purchaseOrder.orderCode == 'ORDER_SIGNED_BY_PM') && (
              <>
                <Button onClick={() => setOpenInvoiceModal(true)}>
                  Upload Invoice
                </Button>

            
            <GenericSendOrderModal
                action={sendOrderToPMAction}
                description="Upload Invoice"
                onClose={() => setOpenInvoiceModal(false)}
                purchaseOrderId={quote.purchaseOrder.id}
                open={openInvoiceModal}
                submitText="Send Invoice"
                title="Send"
                />
              </>
            )} */}

            
          </div>
        </div>
      </div>
    </div>
  );
}
