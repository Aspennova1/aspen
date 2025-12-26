"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";

type Props = {
  invoice: any;
  payout: any | null;
};

export default function PayoutConfirmCard({ invoice, payout }: Props) {
  const [loading, setLoading] = useState(false);
  
  // --------------------
  // CREATE PAYOUT
  // --------------------
  const createPayout = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/pm/vendor-invoices/${invoice.Id}/payout`,
        { method: "POST" }
      );

      const json = await res.json();
      if (!res.ok) toast.error(json.error);

      toast.success("Payout created");
      location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // EXECUTE / RETRY TRANSFER
  // --------------------
  const executeTransfer = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/pm/vendor-invoices/${payout.Id}/execute`,
        { method: "GET" }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast.success("Transfer initiated");
      location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Vendor Payout</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Invoice info */}
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice</span>
            <span className="font-mono text-xs">{invoice.invoiceNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold">
              {formatCurrency(invoice.amount / 100)}
            </span>
          </div>
        </div>

        <hr />

        {/* STATUS TEXT */}
        {payout?.status === "PROCESSING" && (
          <p className="text-sm text-muted-foreground">
            Transfer is currently in progress…
          </p>
        )}

        {payout?.status === "PAID" && (
          <p className="text-sm text-green-600 font-medium">
            ✅ Vendor has been paid
          </p>
        )}

        {payout?.status === "FAILED" && (
          <p className="text-sm text-red-600">
            ❌ Transfer failed. You can retry.
          </p>
        )}

        {!payout && (
          <p className="text-sm text-muted-foreground">
            Create a payout record before transferring funds.
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          {/* CREATE PAYOUT */}
          {!payout && (
            <Button onClick={createPayout} disabled={loading}>
              {loading ? "Creating…" : "Create Payout"}
            </Button>
          )}

          {/* EXECUTE / RETRY */}
          {payout &&
            ["READY", "FAILED"].includes(payout.status) && (
              <Button
                onClick={executeTransfer}
                disabled={loading}
                variant={payout.status === "FAILED" ? "destructive" : "default"}
              >
                {loading
                  ? payout.status === "FAILED"
                    ? "Retrying…"
                    : "Transferring…"
                  : payout.status === "FAILED"
                  ? "Retry Transfer"
                  : "Execute Transfer"}
              </Button>
            )}

          {/* DISABLED STATES */}
          {payout?.status === "PROCESSING" && (
            <Button disabled>Processing…</Button>
          )}

          {payout?.status === "PAID" && (
            <Button disabled variant="secondary">
              Paid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
