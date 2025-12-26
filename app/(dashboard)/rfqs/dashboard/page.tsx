'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateInternalRfqModal } from '@/components/pm/InternalRFQModal';
import { AssignVendorModal } from '@/components/pm/AssignVendorModal';
import { VendorQuoteForPM, ViewVendorQuotesModal } from '@/components/pm/VendorQuotes';
import { PrepareCustomerQuoteModal } from '@/components/pm/CustomerQuoteModal';
import { Attachment } from '@prisma/client';

type RfqListItem = {
  id: string;
  status: {
    code: string;
    label: string;
  };
  createdAt: string;
  isInternalRfqCreated: boolean;
  hasVendorAssigned: boolean,
  hasVendorQuotes: boolean,
  hasAcceptedVendorQuote: boolean,
  isCustomerQuoteSent: boolean,
  attachments: Attachment[]
  // customerQuoteStatus: string;
  rfq: {
    Id: string;
    name: string;
    email: string;
    company: string;
    projectType: string;
  };
  acceptedVendorQuote?: {
    vendorName: string;
    vendorEmail: string;
    amount: number;
    notes?: string | null;
    attachments: Attachment[];
  } | null;

  customerQuoteDetails?: {
    amount: number;
    notes?: string | null;
    attachments: Attachment[];
    statusCode: string;
  } | null;
};

// type VendorQuoteForPM = {
//   assignmentId: string;
//   vendorName: string;
//   vendorEmail: string;
//   amount: number;
//   notes?: string;
//   quoteId: string;
//   statusCode: string;
//   submittedAt: string;
// //   status: {
// //   code : string,
// //   label: string
// // };
// };

type PMRfqItem = {
  id: string; // rfqListId
  rfq: {
    Id: string;
    name: string;
    email: string;
    company: string;
    projectType: string;
  };
};
type ModalType =
  | "NONE"
  | "INTERNAL_RFQ"
  | "ASSIGN_VENDOR"
  | "VIEW_QUOTES"
  | "CUSTOMER_QUOTE";

  
  export default function PMRfqListPage() {
      const [rfqs, setRfqs] = useState<RfqListItem[]>([]);
      const [loading, setLoading] = useState(true);
      const [activeModal, setActiveModal] = useState<ModalType>("NONE");

//   const [openAssign, setOpenAssign] = useState(false);
//   const [openQuotesModal, setOpenQuotesModal] = useState(false);

  const [selectedRfq, setSelectedRfq] = useState<RfqListItem | null>(null);

  const [vendorQuotes, setVendorQuotes] = useState<VendorQuoteForPM[]>([]);
  //const [openInternalRfqModal, setOpenInternalRfqModal] = useState(false);
  const [isAssignVendorOpen, setIsAssignVendorOpen] = useState(false);
  const [isVendorQuotesOpen, setIsVendorQuotesOpen] = useState(false);
  const [isInternalRfqOpen, setIsInternalRfqOpen] = useState(false);
  const [isCusQuoteOpen, setIsCusQuoteOpen] = useState(false);

  useEffect(() => {
  let isMounted = true; // 🔒 prevents state update after unmount

  async function loadRfqs() {
    try {
      const res = await fetch("/api/pm/rfq-list", {
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch RFQs");
      }

      const data = await res.json();

      if (isMounted) {
        setRfqs(data);
      }
    } catch (err) {
      console.error("Fetch RFQs error:", err);

      if (isMounted) {
        // Optional: show UI error
        setRfqs([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadRfqs();

  return () => {
    isMounted = false;
  };
}, []);

  if (loading) return <p className="text-muted-foreground">Loading RFQs…</p>;

  if (!rfqs || rfqs.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="text-5xl">📄</div>
      <h2 className="text-2xl font-semibold">No RFQs yet</h2>
      <p className="text-muted-foreground max-w-md">
        Customer RFQs will appear here once they are submitted.  
        You’ll be able to create internal RFQs, assign vendors, and manage quotes from this page.
      </p>
    </div>
  );
}

  return (
    <div className="p-0 space-y-6">
      <h1 className="text-3xl font-semibold">All RFQs</h1>

      {rfqs && rfqs.map(item =>{
        const isLockedAfterCustomerQuote = item.isCustomerQuoteSent;
        // const isCustomerQuoteSent =
        //     item.customerQuoteStatus === "SENT" ||
        //     item.customerQuoteStatus === "ACCEPTED" ||
        //     item.customerQuoteStatus === "REJECTED";
        return (
        <div
          key={item.id}
          className="border rounded-2xl p-5 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Request ID
              </p>
              <p className="font-semibold">#{item.id}</p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-sm font-medium">
                Status –{' '}
                <span className="text-primary">
                  {item.status.label}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Created {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{item.rfq.name}</p>
              <p className="text-sm">{item.rfq.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{item.rfq.company}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium capitalize">
                {item.rfq.projectType}
              </p>
            </div>
            {item.attachments?.length > 0 && (
              <ul className="mt-1 space-y-1">
                <p className="font-semibold">{`Customer attached files`}</p>
                {item.attachments.map((att) => (
                  <li key={att.Id}>
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      className="text-xs text-blue-600 underline break-all"
                    >
                      {att.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {item.acceptedVendorQuote && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Accepted Vendor
                </p>

                <div className="text-sm">
                  <p className="font-medium">
                    {item.acceptedVendorQuote.vendorName}
                  </p>
                  <p className="text-muted-foreground">
                    {item.acceptedVendorQuote.vendorEmail}
                  </p>
                </div>

                <p className="text-sm">
                  Quote Amount:{" "}
                  <span className="font-medium">
                    {item.acceptedVendorQuote.amount} USD
                  </span>
                </p>

                {item.acceptedVendorQuote.notes && (
                  <p className="text-sm text-muted-foreground">
                    {item.acceptedVendorQuote.notes}
                  </p>
                )}

                {item.acceptedVendorQuote.attachments?.length > 0 && (
                  <ul className="space-y-1">
                    {item.acceptedVendorQuote.attachments.map((att) => (
                      <li key={att.Id}>
                        <a
                          href={att.fileUrl}
                          target="_blank"
                          className="text-xs underline break-all"
                        >
                          {att.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
             
            {item.customerQuoteDetails && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Customer Quote
                </p>

                <p className="text-sm">
                  Sell Price:{" "}
                  <span className="font-medium">
                    {item.customerQuoteDetails.amount} USD
                  </span>
                </p>

                {item.customerQuoteDetails.notes && (
                  <p className="text-sm text-muted-foreground">
                    {item.customerQuoteDetails.notes}
                  </p>
                )}

                {item.customerQuoteDetails.attachments?.length > 0 && (
                  <ul className="space-y-1">
                    {item.customerQuoteDetails.attachments.map((att) => (
                      <li key={att.Id}>
                        <a
                          href={att.fileUrl}
                          target="_blank"
                          className="text-xs underline break-all"
                        >
                          {att.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>


          {/* Footer actions */}
          <div className="flex flex-wrap gap-3">
            
            <div className="flex flex-wrap gap-3">
            <Button
                size="sm"
                disabled={isLockedAfterCustomerQuote || item.isInternalRfqCreated}
                onClick={() => {
                    setSelectedRfq(item);      // 👈 select ONE RFQ
                    // setIsInternalRfqOpen(true);
                    setActiveModal('INTERNAL_RFQ')
                }}
            >
                Create Internal RFQ
            </Button>

            <Button size="sm" className='bg-violet-500' disabled={isLockedAfterCustomerQuote || !item.isInternalRfqCreated} variant={item.isInternalRfqCreated ? "default" : "outline"}
            onClick={() => {
                setSelectedRfq(item);
                // setIsAssignVendorOpen(true);
                setActiveModal('ASSIGN_VENDOR')
            }}
            >
                Assign Vendor
            </Button>

            <Button size="sm" variant="outline" disabled={isLockedAfterCustomerQuote || !item.hasVendorAssigned} className='bg-yellow-500' onClick={async () => {
                setSelectedRfq(item);
                // setIsVendorQuotesOpen(true);
                setActiveModal('VIEW_QUOTES')
                // await loadVendorQuotes(item.id); // rfqListId
            }}>
                View Vendor Quotes
            </Button>

            <Button size="sm" variant="outline" className='bg-green-500' disabled={isLockedAfterCustomerQuote ||!item.hasAcceptedVendorQuote || item.isCustomerQuoteSent} onClick={async () => {
                setSelectedRfq(item);
                setActiveModal('CUSTOMER_QUOTE')
            }}>
                Prepare Customer Quote
            </Button>
            </div>
                </div>
                </div>
            )})}

            {selectedRfq && (
                <>
                <ViewVendorQuotesModal
                    open={activeModal == 'VIEW_QUOTES'}
                    onClose={() => {
                        setIsVendorQuotesOpen(false);
                        setSelectedRfq(null);
                        setVendorQuotes([]);
                    }}
                    rfqId={selectedRfq.rfq.Id}
                    rfqListId= {selectedRfq.id}
                    customerName={selectedRfq.rfq.name}
                    customerEmail={selectedRfq.rfq.email}
                    // quotes={vendorQuotes}
                />
                <CreateInternalRfqModal
                    open={activeModal == 'INTERNAL_RFQ'}
                    onClose={() => {
                    setIsInternalRfqOpen(false);
                    setSelectedRfq(null);
                    }}
                    rfqListId={selectedRfq.id}
                    rfqId={selectedRfq.rfq.Id}
                    rfqName = {selectedRfq.rfq.name}
                    customerName={selectedRfq.rfq.name}
                    customerEmail={selectedRfq.rfq.email}
                />
                    <AssignVendorModal
                        open={activeModal == 'ASSIGN_VENDOR'}
                        onClose={() => {
                        setIsAssignVendorOpen(false);
                        setSelectedRfq(null);
                        }}
                        rfqListId={selectedRfq.id}
                    />
                    <PrepareCustomerQuoteModal 
                      customerEmail={selectedRfq.rfq.name} 
                      customerName={selectedRfq.rfq.email}
                      customerRfqId={selectedRfq.rfq.Id}
                      rfqListId={selectedRfq.id}
                      onClose={() => {
                        setIsCusQuoteOpen(false);
                        setSelectedRfq(null);
                        }}
                      open ={activeModal == 'CUSTOMER_QUOTE'} />
                </>
            )}
        </div>
    );
}
