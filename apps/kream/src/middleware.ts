import NextAuth from 'next-auth';
import { authConfig } from '@/app/api/auth/auth.config';
const { log } = require('@repo/kwe-lib/components/logHelper');
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

log("middleWare");