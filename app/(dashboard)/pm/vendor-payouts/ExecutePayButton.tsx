"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  payout: {
    Id: string;
    vendorAmount: number;
    status: string;
  };
};

export default function ExecutePayoutButton({ payout }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/vendor-payouts/${payout.Id}/execute`,
        { method: "POST" }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to execute payout");
      }

      toast.success("Transfer initiated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only show when READY
  if (payout.status !== "READY") return null;

  return (
    <Button
      size="sm"
      onClick={handleExecute}
      disabled={loading}
    >
      {loading ? "Transferring…" : "Transfer Funds"}
    </Button>
  );
}
