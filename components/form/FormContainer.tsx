'use client';

import { useFormState } from 'react-dom';
import { useActionState, useEffect } from 'react';
// import { useToast } from '@/components/ui/use-toast';
// import { Toaster } from "@/components/ui/sonner"
import { actionFunction } from '@/utils/types';
import { toast } from "sonner"
import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';

const initialState = {
  message: '',
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, initialState);
  // const { toast } = useToast();
  useEffect(() => {
    if (state.message) {
      // alert(state.message);
      if(state.message == 'RFQ created successfully'){
        redirect('/rfqs/my-rfqs');
      }
      if(state.message == 'RFQ Deleted successfully'){
        redirect('/rfqs/my-rfqs');
      }
      if(state.message == 'RFQ updated successfully'){
        redirect('/rfqs/my-rfqs');
      }
      if(state.message == 'Deleted Successfully'){
        redirect('/rfqs/my-rfqs');
      }
      if(state.message.includes('Internal RFQ')){
        redirect('/rfqs/my-rfqs');
      }
      toast(state.message);
    }
  }, [state]);
  return <form action={formAction}>{children}</form>;
}
export default FormContainer;


const initialStateModal = {
  message: '',
  status: false,
};

export type actionFunctionModal = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string, status: boolean }>;


export function FormModalContainer({
  action,
  children,
  onSuccess,
}: {
  action: actionFunctionModal;
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, initialStateModal);
  // const { toast } = useToast();
  useEffect(() => {
    if(!state.status){
      if(state.message){
        toast(state.message);
      }
      return;
    }
    if (state.message) {
      toast(state.message);
      if(state.message == 'Internal RFQ already exists'){
        redirect('/rfqs/dashboard');
      }
      if(state.message == 'Internal RFQ created successfully'){
        redirect('/rfqs/dashboard');
      }
      if(state.message == 'Vendors assigned successfully'){
        redirect('/rfqs/dashboard');
      }
      if(state.message == 'Customer quote created successfully'){
        redirect('/rfqs/dashboard');
      }
      if(state.message == 'Order successfully sent to vendor'){
        redirect('/pm/accepted-rfqs');
      }
      if(state.message == 'Order successfully sent to Project Manager'){
        redirect('/vendor/accepted-quotes');
      }
      if(state.message == 'Order successfully sent to customer'){
        redirect('/pm/accepted-rfqs');
      }
      if(state.message == 'Signed Order successfully sent to customer'){
        redirect('/pm/accepted-rfqs');
      }
      // alert(state.message);
      onSuccess?.();
    }
  }, [state]);
  return <form action={formAction}>{children}</form>;
}
