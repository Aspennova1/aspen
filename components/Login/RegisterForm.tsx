"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormSelect, { CustomFormField, CustomFormFieldPlaceholder, CustomPassowrdField } from "@/components/FormComponents";
import { registerUserSchema, RegisterUserType, RFQCompanies } from "@/utils/types";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterUserType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { loadUser} = useAuth();
  async function onSubmit(values: RegisterUserType) {
    if(loading) return;
    try{
      setLoading(true);
      const res = await fetch("/api/register", {
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
    catch(err){
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormFieldPlaceholder name="name" placeholder="Enter your name" control={form.control} />
        <CustomFormFieldPlaceholder name="email" placeholder="Enter your email" control={form.control} />
        {/* <CustomFormSelect
                    name='subcompany'
                    control={form.control}
                    labelText='Aspen Sub Company'
                    items={Object.values(RFQCompanies)}
                  /> */}
        <CustomPassowrdField name="password" control={form.control} />
        <CustomFormFieldPlaceholder placeholder="Retype your password" name="confirmPassword" value="Retype password" control={form.control} />
        <Button className="w-full" type="submit">
          Create Account
        </Button>
      </form>
    </Form>
  );
}
