"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormFieldPlaceholder } from "@/components/FormComponents";

import {
  forgotPasswordSchema,
  ForgotPasswordType,
} from "@/utils/types";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
//   const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordType) {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        if(data.status){
          setResponseMessage(data.message);
        }
        else{
          setResponseMessage(data.message);
        }
        return;
      }
      else{
        if(res.status == 429){
          setResponseMessage(data.message)
        }
        else{
          setResponseMessage('Something went wrong!!');
        }
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold text-center">
            Forgot Password
          </h2>

          {!responseMessage ? (
            <>
              <CustomFormFieldPlaceholder
                name="email"
                placeholder="Enter your email"
                control={form.control}
              />

              <Button
                disabled={loading}
                type="submit"
                className="w-full text-lg"
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              {responseMessage}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
