"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"
import { StatusBadge } from "@/components/pm/VendorQuotes";
import { UploadPurchaseOrderModal } from "@/components/customer/PurchaseModal";
import { CustomerAcceptedRFQ } from "@/utils/types";
import { useRouter } from "next/navigation";
import AttachmentCard from "../attachments/AttachmentCard";

type Props = {
  rfq: CustomerAcceptedRFQ;
};

export default function CustomerAcceptedRfqCard({ rfq }: Props) {
  
  const [open, setOpen] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

  const hasAnyAttachments =
  rfq.customerQuote.attachments.length > 0 ||
  (rfq.purchaseOrder?.customerPOAttachments?.length ?? 0) > 0 ||
  (rfq.purchaseOrder?.pmSignedOrderToCustomerAttachments?.length ?? 0) > 0;

  const router = useRouter();

  const handlePay = async (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
    try{
      router.push(`/pay/${invoiceId}/payment`);
    }
    catch(err){
      toast.error('Failed to redirect to payment page');
      setPayingInvoiceId(null);
    }
  }

  return (
    <>
      <div className="rounded-xl border p-6 space-y-6 bg-white">
        {/* 🔹 Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="text-lg font-semibold">{rfq.company}</p>
          </div>

          <StatusBadge status={rfq.orderStatus} />
        </div>

        {/* 🔹 Customer Quote */}
        {/* <div>
          <p className="text-lg font-semibold">Customer Quote</p>
          {rfq.customerQuote.notes && (
            <p className="text-sm text-muted-foreground">
              {rfq.customerQuote.notes}
            </p>
          )}
        </div> */}

          {hasAnyAttachments && (
          <div className="space-y-3">
            <p className="text-lg font-semibold">Attachments</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AttachmentCard
                title="Project Attachments"
                files={rfq.customerQuote.attachments}
              />

              <AttachmentCard
                title="Purchase Order Attachments"
                files={rfq.purchaseOrder?.customerPOAttachments || []}
              />

              <AttachmentCard
                title="Signed Order"
                files={rfq.purchaseOrder?.pmSignedOrderToCustomerAttachments || []}
              />
            </div>
          </div>
          )}

        {/* 🔹 Invoices */}
        {(rfq.purchaseOrder?.customerInvoices?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <p className="text-lg font-semibold flex items-center gap-2">
              <Paperclip size={16} />
              Invoices
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rfq.purchaseOrder?.customerInvoices.map((invoice, index) => (
                <div
                  key={invoice.id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Invoice {index + 1}</p>
                    <StatusBadge
                      status={
                        invoice.statusCode === "SENT"
                          ? "Invoice Received"
                          : invoice.statusCode
                      }
                    />
                  </div>

                  {/* Amount */}
                  <p className="text-sm">
                    Amount:{" "}
                    <span className="font-medium">
                      {(invoice.amount / 100).toFixed(2)} USD
                    </span>
                  </p>

                  {/* Description */}
                  {invoice.description && (
                    <p className="text-sm text-muted-foreground">
                      {invoice.description}
                    </p>
                  )}

                  {/* Date */}
                  <p className="text-xs text-muted-foreground">
                    Sent on {new Date(invoice.createdAt).toLocaleString()}
                  </p>

                  {/* Invoice Attachments */}
                  {invoice.invoiceAttachments?.length > 0 && (
                    <div className="space-y-1">
                      {invoice.invoiceAttachments.map((file) => (
                        <Link
                          key={file.Id}
                          href={file.fileUrl}
                          target="_blank"
                          className="block text-sm text-blue-600 hover:underline break-all"
                        >
                          {file.fileName}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex justify-end">
                    {invoice.statusCode === "SENT" && (
                      <Button
                        size="sm"
                        disabled={payingInvoiceId === invoice.id}
                        onClick={() => handlePay(invoice.id)}
                      >
                        {payingInvoiceId === invoice.id
                          ? "Redirecting..."
                          : "Pay Now"}
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

        {/* 🔹 Quote Amount */}
        <p className="font-medium">
          Quote Amount{" "}
          <span className="font-semibold">
            {rfq.customerQuote.sellPrice} USD
          </span>
        </p>

        {/* 🔹 Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Accepted on{" "}
            {rfq.customerQuote.decidedAt
              ? new Date(rfq.customerQuote.decidedAt).toLocaleDateString()
              : "-"}
          </p>

          {rfq.orderStatus === "Order Pending" && (
            <Button onClick={() => setOpen(true)}>
              Upload Purchase Order
            </Button>
          )}
        </div>
      </div>

      {/* 🔹 Modal */}
      <UploadPurchaseOrderModal
        open={open}
        onClose={() => setOpen(false)}
        rfqListId={rfq.rfqListId}
        customerQuoteId={rfq.customerQuote.id}
      />
    </>
  );
}
