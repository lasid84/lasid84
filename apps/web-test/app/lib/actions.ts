'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

//Next-Auth 인증
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const {log} = require('@repo/kwe-lib/components/logHelper');

const FormSchema = z.object({
    // id: z.string(),
    // customerId: z.string(),
    // amount: z.coerce.number(),
    // status: z.enum(['pending', 'paid']),
    // date: z.string(),

    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
  });

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};  
 
export async function createInvoice(prevState: State, formData: FormData) {
//   const rawFormData = {
    // const { customerId, amount, status } = CreateInvoice.parse({
  
   // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  console.log(new Date().toISOString());

//   필드가 많은 양식으로 작업하는 경우 아래와 같이 사용
//   const rawFormData = Object.fromEntries(formData.entries());

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  // Test it out:
//   console.log(rawFormData);
}

//export async function updateInvoice(id: string, formData: FormData) {
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    // const { customerId, amount, status } = UpdateInvoice.parse({
    const validatedFields = UpdateInvoice.safeParse({      
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
   
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
   
    try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');

    
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice' };
      } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice' };
      }
  }

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    log("action의 authenticate 시작", formData);
    try {
      
      const user = await signIn('credentials', formData);
      
      // return {
      //   success: true,
      //   data: user
      // };
      
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
          //   return {
          //     success: false,
          //     message:'Invalid credentials.2',
          //     // m: '1234'
          // };
          return 'Invalid credentials.2';
          default:
            // {
            //   return {
            //     success: false,
            //     message:'Something went wrong.2',
            //   };
              return 'Something went wrong.2';
          // }
        }
      }
      throw error;
    }
  }

