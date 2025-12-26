"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormField, CustomFormFieldPlaceholder, CustomFormPlaceholderPass, CustomFormSelect, CustomFormTextArea, CustomPassowrdField } from "@/components/FormComponents";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/context/AuthContext";


const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});

export type LoginType = z.infer<typeof loginSchema>;

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { loadUser, setUser, user } = useAuth();

  async function onSubmit(values: LoginType) {
    if(loading) return;
    try{
      setLoading(true);
      const res = await fetch("/api/login", {
       method: "POST",
       body: JSON.stringify(values),
     });
 
      const data = await res.json();
 
      if (!res.ok) {
        alert(data.error);
        return;
      }
 
      await loadUser();
      onSuccess();
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormFieldPlaceholder name="email" placeholder="Enter your email" control={form.control} />
        <CustomFormPlaceholderPass name="password" placeholder="Enter your password" control={form.control} />

        <div className="text-right">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>
        <Button disabled={loading} type="submit" className="w-full text-lg">
          {loading ? 'Please wait..': 'Login'}
        </Button>
      </form>
    </Form>
  );
}
