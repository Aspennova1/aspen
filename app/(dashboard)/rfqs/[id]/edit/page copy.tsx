'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  RFQCompanies,
  CreateAndEditRFQType,
  createAndEditRFQSchema
} from '@/utils/types';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CustomFormField, CustomFormFieldDisable, CustomFormSelect, CustomFormTextArea } from '@/components/FormComponents';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';

const EditRFQPage = ()=> {

  const {id} = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [rfq, setRfq] = useState<CreateAndEditRFQType>();
  // const existingData = await getRFQById(params.id);
  const form = useForm<CreateAndEditRFQType>({
    resolver: zodResolver(createAndEditRFQSchema)
    });

  useEffect(() => {
    if (!id) return;

    const fetchRFQ = async () => {
      const res = await fetch(`/api/rfqs/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/rfqs/my-rfqs");
        return;
      }

      const data = await res.json();
      form.reset(data.rfq);
      setLoading(false);
    };

    fetchRFQ();
  }, [id, form, router]);

  useEffect(() => {
    if (rfq) {
      form.reset(rfq);
    }
  }, [rfq, form]);

const onSubmit = async (values: CreateAndEditRFQType) => {
    const res = await fetch(`/api/rfqs/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/rfqs/my-rfqs");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (

      <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='p-8 rounded border-2 border-muted'
            >
              <h2 className='capitalize font-semibold text-4xl mb-6'>Edit an RFQ</h2>
              
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start'>
                {/* position */}
                <CustomFormField name='name' control={form.control} />
                {/* company */}
                <CustomFormFieldDisable name='email' control={form.control} disable={true} />
      
                {/* job status */}
                <CustomFormSelect
                  name='company'
                  control={form.control}
                  labelText='Company'
                  items={Object.values(RFQCompanies)}
                />
                
                <CustomFormField name='projectType' value='Project Type' control={form.control} />
                <CustomFormTextArea name='briefDescription' value='Brief Description' control={form.control} />
                <CustomFormField name='budgetRange' value='Budget Range' control={form.control} />
                <CustomFormField name='timeline' control={form.control} />
      
                <Button type='submit' className='self-end capitalize'>
                  Update RFQ
                </Button>
              </div>
            </form>
          </Form>
  );
}
export default EditRFQPage