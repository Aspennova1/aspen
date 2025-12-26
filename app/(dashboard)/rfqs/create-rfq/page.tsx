// 'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  RFQCompanies,
  CreateAndEditRFQType,
  createAndEditRFQSchema
} from '@/utils/types';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CustomFormField, CustomFormFieldDisable, CustomFormSelect, CustomFormTextArea, CustomInputFileField } from '@/components/FormComponents';
import { useAuth } from '@/components/context/AuthContext';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import FormContainer from '@/components/form/FormContainer';
import FormInput, { FormDisableInput } from '@/components/form/FormInput';
import FormSelect from '@/components/form/FormSelect';
import TextAreaInput from '@/components/form/TextAreaInput';
import { SubmitButton } from '@/components/form/Buttons';
import { createRFQAction } from '@/utils/actions';
import ImageInput, { Attachment, Attachments } from '@/components/form/ImageInput';
import { getAuthUser } from '@/utils/auth';


async function CreateRFC() {
  const user = await getAuthUser();
  return (
    <FormContainer action={createRFQAction}>

      <div className='p-8 rounded border-2 border-muted'>
        <h2 className='capitalize font-semibold text-4xl mb-6'>Request an RFQ</h2>
        
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end'>
          {/* position */}
          <FormInput name='name' defaultValue={user.name} type='text' label='Name' />
          {/* company */}
          <FormDisableInput name='email' defaultValue={user.email} type='text' label='Email' />

          <FormSelect name='company' options={Object.values(RFQCompanies)} defaultValue={Object.values(RFQCompanies)[0]} label='Email' />
          
          <FormInput name='projectType' defaultValue={'dedwe'} type='text' label='Project Type' />
          <FormInput name='budgetRange' defaultValue={'fefe'} type='text' label='Budget Range' placeholder='100' />
          <FormInput name='timeline' defaultValue={'rfe'} type='text' label='Timeline' placeholder='2months' />
          <TextAreaInput name='briefDescription' defaultValue={'cecec'} labelText='Brief Description'  />
          <Attachments />
          <SubmitButton text="Submit RFQ" />
        </div>
        </div>
    </FormContainer>
  );
}

export default CreateRFC