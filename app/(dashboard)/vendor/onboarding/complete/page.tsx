export default function OnboardingComplete() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-4">
      <h1 className="text-xl font-semibold">Onboarding Submitted</h1>
      <p className="text-muted-foreground">
        We’re verifying your details with Stripe.
        You’ll be notified once payouts are enabled.
      </p>
    </div>
  );
}
