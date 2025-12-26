"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type OnboardingStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "RESTRICTED";

type StatusResponse = {
  status: OnboardingStatus;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export default function VendorOnboardingCard() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    fetch("/api/vendor/onboarding/status")
      .then((res) => {
        if(!res.ok){
            throw new Error('Failed to fetch status!')
        }
        return res.json();
      })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const startOnboarding = async () => {
    setRedirecting(true);
    const res = await fetch("/api/vendor/onboarding/start", {
      method: "POST",
    });
    const json = await res.json();

    if (json.onboardingUrl) {
      window.location.href = json.onboardingUrl;
    } else {
      setRedirecting(false);
      alert("Failed to start onboarding");
    }
  };

  if (loading) {
    return <p>Loading onboarding status...</p>;
  }

  if (!data) {
    return <p>Unable to load onboarding status</p>;
  }

  return (
    <div className="rounded-xl border p-6 bg-white space-y-4 max-w-md">
      <h2 className="text-lg font-semibold">Payout Setup</h2>

      {/* Status message */}
      {data.status === "NOT_STARTED" && (
        <p className="text-muted-foreground">
          To receive payments, you must complete Stripe onboarding.
        </p>
      )}

      {data.status === "IN_PROGRESS" && (
        <p className="text-muted-foreground">
          Your onboarding is in progress. Please complete the remaining steps.
        </p>
      )}

      {data.status === "COMPLETED" && (
        <p className="text-green-600 font-medium">
          ✅ Payouts are enabled. You’re all set!
        </p>
      )}

      {data.status === "RESTRICTED" && (
        <p className="text-red-600">
          ⚠️ Action required. Fix issues to receive payouts.
        </p>
      )}

      {/* Action button */}
      {data.status !== "COMPLETED" && (
        <Button
          onClick={startOnboarding}
          disabled={redirecting}
          className="w-full"
        >
          {redirecting
            ? "Redirecting…"
            : data.status === "NOT_STARTED"
            ? "Start onboarding"
            : "Continue onboarding"}
        </Button>
      )}
    </div>
  );
}
