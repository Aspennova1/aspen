'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';

export type AuthUser = {
  Id: string;
  email: string;
  name: string;
  roleId: number;
  role: string;
};

export const getAuthUser = async (
  allowedRoleIds?: number[]
): Promise<AuthUser> => {
  const token = (await cookies()).get('token')?.value;

  
  if (!token) redirect('/');
  
  const payload = await verifyToken(token);
  
  if (!payload?.email || !payload?.Id) {
    redirect('/');
  }
  if ( allowedRoleIds && !allowedRoleIds.includes(payload.roleId)) {
    console.log('No access');
    throw new Error('You have no access');
    redirect('/unauthorized');
  }

  return {
    Id: payload.Id,
    email: payload.email,
    name: payload.name,
    roleId: payload.roleId,
    role: payload.role
  };
};
