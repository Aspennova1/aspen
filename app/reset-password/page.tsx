"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormPlaceholderPass } from "@/components/FormComponents";
import { resetPasswordSchema, ResetPasswordType } from "@/utils/types";

/* ---------------- Page ---------------- */

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  /* -------- Validate token on load -------- */

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${token}`
        );
        const data = await res.json();
        setIsValidToken(data.valid === true);
      } catch {
        setIsValidToken(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  /* -------- Submit new password -------- */

  async function onSubmit(values: ResetPasswordType) {
    if (loading || !token) return;
    
    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }
      
      if(data.status){
          router.push("/?login=true");
      }
      else{
        alert(data.message);
      }
      // ✅ Redirect in a way that OPENS LOGIN MODAL
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI STATES ---------------- */

  // ⏳ VALIDATING (CENTERED)
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-3xl">
          Validating reset link...
        </p>
      </div>
    );
  }

  // ❌ INVALID TOKEN (CENTERED)
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-semibold">
            Invalid or expired link
          </h2>

          <p className="text-muted-foreground">
            Please request a new password reset.
          </p>

          <Button
            onClick={() => router.push("/forgot-password")}
          >
            Go to Forgot Password
          </Button>
        </div>
      </div>
    );
  }

  // ✅ VALID TOKEN → FORM (CENTERED)
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold text-center">
            Reset Password
          </h2>

          <CustomFormPlaceholderPass
            name="password"
            placeholder="New password"
            control={form.control}
          />

          <CustomFormPlaceholderPass
            name="confirmPassword"
            placeholder="Confirm new password"
            control={form.control}
          />

          <Button
            disabled={loading}
            type="submit"
            className="w-full text-lg"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
