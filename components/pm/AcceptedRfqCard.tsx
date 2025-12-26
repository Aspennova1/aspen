'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Paperclip } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PMAcceptedRFQ } from '@/utils/types';
import { GenericSendOrderModal } from './GenericSendOrderModal';
import {
  sendInvoiceToPMAction,
  sendOrderToVendorAction,
  sendSignedOrderToCustomer,
} from '@/utils/actions';
import { GenericSendInvoiceModal } from './GenericSendInvoiceModal';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"

type Props = {
  rfq: PMAcceptedRFQ;
};

export default function PMAcceptedRfqCard({ rfq }: Props) {
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openSignedModal, setOpenSignedModal] = useState(false);
  const [openCustomerInvoiceModal, setOpenCustomerInvoiceModal] = useState(false);
  const [payingVendorInvoiceId, setPayingVendorInvoiceId] = useState<string | null>(null);
  const router = useRouter();
  const handleVendorPay = async (invoiceId: string) => {
    try {
      setPayingVendorInvoiceId(invoiceId);

      // This should go to PM payout approval / payout creation page
      // NOT Stripe checkout
      router.push(`/pm/vendor-invoices/${invoiceId}/payout`);
    } catch (err) {
      toast.error("Failed to start vendor payout");
      setPayingVendorInvoiceId(null);
    }
  };
  // const hasVendorInvoices =
  // rfq.purchaseOrder?.vendorInvoices &&
  // rfq.purchaseOrder.vendorInvoices.length > 0;

  // const hasCustomerInvoices = 
  //   rfq.purchaseOrder?.customerInvoices &&
  //   rfq.purchaseOrder.customerInvoices.length > 0;

  return (
    <div className="w-full rounded-xl border bg-background p-6">
      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_2fr_2fr]">

        {/* ================= COLUMN 1 : CUSTOMER ================= */}
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Customer</p>
            <p className="font-semibold capitalize">{rfq.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {rfq.customer.email}
            </p>
          </div>

          <div>
            <p className="font-medium">Customer Quote</p>
            <p className="text-sm text-muted-foreground">
              {rfq.customerQuote.sellPrice} USD
            </p>
            {rfq.customerQuote.notes && (
              <p className="text-sm">{rfq.customerQuote.notes}</p>
            )}

              <div>
              {rfq.customerQuote.attachments.length > 0 && (
                <div className="space-y-1">
                  <div className="pl-0 mt-1 space-y-1">
                    {rfq.customerQuote.attachments.map((file) => (
                      <Link
                        key={file.Id}
                        href={file.fileUrl}
                        target="_blank"
                        // className="block text-sm underline underline-offset-2"
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {file.fileName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              </div>
          </div>
        </div>

        {/* ================= COLUMN 2 : CUSTOMER PO & PM ORDER ================= */}
        <div className="space-y-6">
          {rfq.purchaseOrder ? (
            <>
              {/* Customer PO */}
              {rfq.purchaseOrder.customerPOAttachments.length > 0 && (
                <div className="space-y-1">
                  <p className="font-medium flex items-center gap-2">
                    <Paperclip size={16} />
                    Customer Purchase Order
                  </p>

                  {rfq.purchaseOrder.customerPOAttachments[0]?.description && (
                    <p className="text-xs text-muted-foreground pl-6">
                      {rfq.purchaseOrder.customerPOAttachments[0].description}
                    </p>
                  )}

                  <div className="pl-6 space-y-1">
                    {rfq.purchaseOrder.customerPOAttachments.map((file) => (
                      <Link
                        key={file.Id}
                        href={file.fileUrl}
                        target="_blank"
                        // className="block text-sm underline underline-offset-2"
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {file.fileName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Order to Vendor */}
              {rfq.purchaseOrder.orderToVendorAttachments.length > 0 && (
                <div className="space-y-1">
                  <p className="font-medium flex items-center gap-2">
                    <Paperclip size={16} />
                    Order to Vendor
                  </p>

                  {rfq.purchaseOrder.orderToVendorAttachments[0]?.description && (
                    <p className="text-xs text-muted-foreground pl-6">
                      {rfq.purchaseOrder.orderToVendorAttachments[0].description}
                    </p>
                  )}

                  <div className="pl-6 space-y-1">
                    {rfq.purchaseOrder.orderToVendorAttachments.map((file) => (
                      <Link
                        key={file.Id}
                        href={file.fileUrl}
                        target="_blank"
                        // className="block text-sm underline underline-offset-2"
                        className="block text-sm text-blue-600 hover:underline"
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
              Customer has not uploaded purchase order yet.
            </p>
          )}
        </div>

        {/* ================= COLUMN 3 : SIGNED DOCUMENTS ================= */}
        <div className="space-y-6">
          {rfq.purchaseOrder ? (
            <>
              {/* Vendor → PM (Signed Order) */}
              {rfq.purchaseOrder.vendorSignedOrderAttachments &&
                rfq.purchaseOrder.vendorSignedOrderAttachments.length > 0 && (
                  <div className="space-y-1">
                    <p className="font-medium flex items-center gap-2">
                      <Paperclip size={16} />
                      Vendor Signed Order
                    </p>

                    {rfq.purchaseOrder.vendorSignedOrderAttachments[0]?.description && (
                      <p className="text-xs text-muted-foreground pl-6">
                        {
                          rfq.purchaseOrder
                            .vendorSignedOrderAttachments[0].description
                        }
                      </p>
                    )}

                    <div className="pl-6 space-y-1">
                      {rfq.purchaseOrder.vendorSignedOrderAttachments.map((file) => (
                        <Link
                          key={file.Id}
                          href={file.fileUrl}
                          target="_blank"
                          // className="block text-sm underline underline-offset-2"
                          className="block text-sm text-blue-600 hover:underline"
                        >
                          {file.fileName}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              {/* PM → Customer (Signed Order) */}
              {rfq.purchaseOrder.pmSignedOrderToCustomerAttachments &&
                rfq.purchaseOrder.pmSignedOrderToCustomerAttachments.length > 0 && (
                  <div className="space-y-1">
                    <p className="font-medium flex items-center gap-2">
                      <Paperclip size={16} />
                      Signed Order Sent to Customer
                    </p>

                    {rfq.purchaseOrder.pmSignedOrderToCustomerAttachments[0]
                      ?.description && (
                      <p className="text-xs text-muted-foreground pl-6">
                        {
                          rfq.purchaseOrder
                            .pmSignedOrderToCustomerAttachments[0].description
                        }
                      </p>
                    )}

                    <div className="pl-6 space-y-1">
                      {rfq.purchaseOrder.pmSignedOrderToCustomerAttachments.map(
                        (file) => (
                          <Link
                            key={file.Id}
                            href={file.fileUrl}
                            target="_blank"
                            // className="block text-sm underline underline-offset-2"
                            className="block text-sm text-blue-600 hover:underline"
                          >
                            {file.fileName}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
            </>
          ) : null}
        </div>

          {rfq.purchaseOrder?.vendorInvoices &&
            rfq.purchaseOrder.vendorInvoices.length > 0 && (
              <div className="mt-6 border-t pt-4 space-y-4 col-span-full">
                <p className="font-medium flex items-center gap-2">
                  <Paperclip size={16} />
                  Vendor Submitted Invoices
                </p>

                <div className="space-y-4">
                  {rfq.purchaseOrder.vendorInvoices.map((invoice, index) => (
                    <div
                      key={invoice.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">
                          Invoice {index + 1}
                        </p>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {invoice.statusCode === 'SENT'
                                ? 'SUBMITTED'
                              : invoice.statusCode}
                          </Badge>
                        </div>
                      </div>

                      {/* Meta */}
                      <p className="text-sm text-muted-foreground">
                        Amount:{' '}
                        <span className="font-medium">
                          {(invoice.amount / 100).toFixed(2)} USD
                        </span>
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Description: 
                        <span className="font-medium">
                          {` ${invoice.description}`}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Submitted on{' '}
                        {new Date(invoice.createdAt).toLocaleString()}
                      </p>

                      {/* Attachments */}
                      {invoice.invoiceAttachments.length > 0 && (
                        <div className="pt-2 space-y-1">
                          {invoice.invoiceAttachments.map((file) => (
                            <Link
                              key={file.Id}
                              href={file.fileUrl}
                              target="_blank"
                              className="block text-sm text-blue-600 hover:underline"
                            >
                              {file.fileName}
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="pt-3 flex justify-end">
                        {invoice.statusCode === "SENT" && (
                          <Button
                            size="sm"
                            disabled={payingVendorInvoiceId === invoice.id}
                            onClick={() => handleVendorPay(invoice.id)}
                          >
                            {payingVendorInvoiceId === invoice.id
                              ? "Redirecting..."
                              : "Pay Vendor"}
                          </Button>
                        )}
                        {invoice.statusCode === "PAID" && (
                          <Button size="sm" disabled variant="secondary">
                            Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          )}

          {rfq.purchaseOrder?.customerInvoices &&
            rfq.purchaseOrder.customerInvoices.length > 0 && (
              <div className="mt-6 border-t pt-4 space-y-4 col-span-full">
                <p className="font-medium flex items-center gap-2">
                  <Paperclip size={16} />
                  Invoices Sent to Customer
                </p>

                <div className="space-y-4">
                  {rfq.purchaseOrder.customerInvoices.map((invoice, index) => (
                    <div
                      key={invoice.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">
                          Invoice {index + 1}
                        </p>

                        <Badge variant="secondary">
                          {invoice.statusCode}
                        </Badge>
                      </div>

                      {/* Meta */}
                      <p className="text-sm text-muted-foreground">
                        Amount:{' '}
                        <span className="font-medium">
                          {(invoice.amount / 100).toFixed(2)} USD
                        </span>
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Description:
                        <span className="font-medium">
                          {` ${invoice.description ?? '-'}`}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Sent on{' '}
                        {new Date(invoice.createdAt).toLocaleString()}
                      </p>

                      {/* Attachments */}
                      {invoice.invoiceAttachments.length > 0 && (
                        <div className="pt-2 space-y-1">
                          {invoice.invoiceAttachments.map((file) => (
                            <Link
                              key={file.Id}
                              href={file.fileUrl}
                              target="_blank"
                              className="block text-sm text-blue-600 hover:underline"
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
      {rfq.purchaseOrder && (
        <div className="mt-6 border-t pt-4 col-span-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {/* <Badge variant="outline">{rfq.orderStatus}</Badge> */}
              {rfq.orderCode === 'SENT_TO_VENDOR' && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                  Awaiting signed order from vendor
                </Badge>
              )}
              {rfq.purchaseOrder.pmSignedOrderToCustomerAttachments.length == 0 && rfq.orderCode === 'VENDOR_SIGNED' && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                  Send signed order to customer
                </Badge>
              )}
              {rfq.purchaseOrder.pmSignedOrderToCustomerAttachments.length !== 0 && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                  Send Invoice to Customer
                </Badge>
              )}
              
              {/* For Exact flow */}
              {/* {hasVendorInvoices && !hasCustomerInvoices && (
                <Badge
                  variant="outline"
                  className="border-yellow-400 text-yellow-600"
                >
                  Send Invoice to Customer
                </Badge>
              )} */}
              {(!rfq.purchaseOrder?.vendorInvoices ||
                  rfq.purchaseOrder.vendorInvoices.length === 0) && (
                  <Badge
                    variant="outline"
                    className="border-yellow-400 text-yellow-600"
                  >
                    Awaiting Vendor Invoice
                  </Badge>
              )}
              {rfq.orderCode === 'ORDER_SUBMITTED' && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                  {/* Awaiting signed order for customer */}
                  Send order to vendor
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {rfq.orderCode === 'ORDER_SUBMITTED' && (
                <Button onClick={() => setOpenSendModal(true)}>
                  Send Order to Vendor
                </Button>
              )}
              {rfq.orderCode === 'VENDOR_SIGNED' && (
                <Button
                  variant="outline"
                  onClick={() => setOpenSignedModal(true)}
                >
                  Send Signed Order to Customer
                </Button>
              )}
              {rfq.purchaseOrder.pmSignedOrderToCustomerAttachments.length !== 0 && (
                <Button onClick={() => setOpenCustomerInvoiceModal(true)}>
                  Send Invoice to Customer
                </Button>
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      {rfq.purchaseOrder && (
        <>
          <GenericSendOrderModal
            action={sendOrderToVendorAction}
            description="Order Description"
            onClose={() => setOpenSendModal(false)}
            purchaseOrderId={rfq.purchaseOrder.id}
            open={openSendModal}
            submitText="Send order"
            title="Send order to vendor"
          />

          <GenericSendOrderModal
            action={sendSignedOrderToCustomer}
            description="Signed Order Description"
            onClose={() => setOpenSignedModal(false)}
            purchaseOrderId={rfq.purchaseOrder.id}
            open={openSignedModal}
            submitText="Send to Customer"
            title="Send Signed order to Customer"
          />

          <GenericSendInvoiceModal
            action={sendInvoiceToPMAction}
            description="Invoice Description"
            onClose={() => setOpenCustomerInvoiceModal(false)}
            purchaseOrderId={rfq.purchaseOrder.id}
            open={openCustomerInvoiceModal}
            submitText="Send to customer"
            title="Send Invoice"
            />
              
        </>
      )}
    </div>
    </div>
  );
}
