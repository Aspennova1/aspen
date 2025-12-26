'use client';

import { useEffect } from "react";

export default function OnboardingRefresh() {
  useEffect(() => {
    fetch("/api/vendor/onboarding/start", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.onboardingUrl) {
          window.location.href = data.onboardingUrl;
        }
      });
  }, []);

  return (
    <p className="text-center mt-20">
      Redirecting you back to onboarding...
    </p>
  );
}
