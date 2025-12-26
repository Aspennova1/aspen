'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createVendorSchema,
  CreateVendorType,
} from "@/utils/types";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  CustomFormField,
} from "@/components/FormComponents";

export default function CreateVendorPage() {
  const form = useForm<CreateVendorType>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      location: "",
      password: ""
    },
  });

  async function onSubmit(values: CreateVendorType) {
    const res = await fetch("/api/pm/createvendor", {
      method: "POST",
      body: JSON.stringify(values),
    });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  // await loadUser();
  // onSuccess();

  form.reset();
  alert('Vendor Created Successfully!');

    // 🚧 API call will be wired next step
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-8 rounded border-2 border-muted"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">
          Create Vendor
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* Vendor Name */}
          <CustomFormField
            name="name"
            control={form.control}
            value="Vendor Name"
          />

          {/* Email */}
          <CustomFormField
            name="email"
            control={form.control}
            value="Email"
          />

          {/* Mobile */}
          <CustomFormField
            name="mobile"
            control={form.control}
            value="Mobile Number"
          />

          {/* City / Location */}
          <CustomFormField
            name="location"
            control={form.control}
            value="City"
          />

          <CustomFormField name="password" control={form.control}
            value="Temporary password" />

          {/* Submit */}
          <Button
            type="submit"
            className="self-end capitalize"
          >
            Create Vendor
          </Button>
        </div>
      </form>
    </Form>
  );
}
