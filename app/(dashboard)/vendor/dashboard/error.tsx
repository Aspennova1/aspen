"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">
        Something went wrong
      </h2>

      <p className="text-sm text-muted-foreground">
        {error.message || "Unable to load vendor RFQs."}
      </p>

      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
