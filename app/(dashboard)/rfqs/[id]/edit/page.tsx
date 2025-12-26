// import { updateRFQAction } from '@/actions/rfq/updateRFQAction';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/utils/auth';

import {
  RFQCompanies,
  CreateAndEditRFQType,
} from '@/utils/types';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import FormContainer from '@/components/form/FormContainer';
import { IconButton, SubmitButton } from '@/components/form/Buttons';
import TextAreaInput from '@/components/form/TextAreaInput';
import FormInput, { FormDisableInput } from '@/components/form/FormInput';
import FormSelect from '@/components/form/FormSelect';
import { getRfqDetails, updateRFQAction } from '@/utils/actions';
import { Attachments } from '@/components/form/ImageInput';

type Props = {
  params: { id: string };
};

export default async function EditRFQPage({ params }: Props) {
  // const user = await getAuthUser();
  const { id } = await params;

  const rfq = await getRfqDetails(id);

  const defaultValues: CreateAndEditRFQType = {
    name: rfq.name,
    email: rfq.email,
    company: rfq.company as any,
    projectType: rfq.projectType,
    briefDescription: rfq.briefDescription,
    budgetRange: rfq.budgetRange ?? '',
    timeline: rfq.timeline ?? '',
  };

  return (
    <FormContainer action={updateRFQAction.bind(null, id)}>
  <div className="p-8 rounded border-2 border-muted">
    <h2 className="capitalize font-semibold text-4xl mb-6">
      Edit an RFQ
    </h2>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
      {/* Name */}
      <FormInput
        name="name"
        type="text"
        label="Name"
        defaultValue={rfq.name}
      />

      {/* Email (disabled but submitted via hidden input inside component) */}
      <FormDisableInput
        name="email"
        type="text"
        label="Email"
        defaultValue={rfq.email}
      />

      {/* Company */}
      <FormSelect
        name="company"
        label="Company"
        options={Object.values(RFQCompanies)}
        defaultValue={rfq.company}
      />

      {/* Project Type */}
      <FormInput
        name="projectType"
        type="text"
        label="Project Type"
        defaultValue={rfq.projectType}
      />

      {/* Budget */}
      <FormInput
        name="budgetRange"
        type="text"
        label="Budget Range"
        placeholder="100"
        defaultValue={rfq.budgetRange ?? ''}
      />

      {/* Timeline */}
      <FormInput
        name="timeline"
        type="text"
        label="Timeline"
        placeholder="2 months"
        defaultValue={rfq.timeline ?? ''}
      />

      {/* Description */}
      <TextAreaInput
        name="briefDescription"
        labelText="Brief Description"
        defaultValue={rfq.briefDescription}
      />

      <Attachments />
      {/* Submit */}
      <SubmitButton text="Update RFQ" />
    </div>
  </div>
</FormContainer>

  );
}
