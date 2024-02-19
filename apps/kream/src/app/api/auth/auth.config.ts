import { request } from 'http';
import type { NextAuthConfig, Profile } from 'next-auth';
const {log} = require('@repo/kwe-lib/components/logHelper');
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      log("authorized 시작")
      const isLoggedIn = !!auth?.user;
      const isLogInPage = nextUrl.pathname.startsWith('/login');

      // console.log("1.---------------", isLoggedIn, isOnDashboard, auth);

      if (isLogInPage) {
        if (isLoggedIn) { 
          // console.log("1.5---------------", isLoggedIn, isLogInPage, auth, nextUrl);
          // return true;
          return Response.redirect(new URL('/', nextUrl));
        };
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        nextUrl.username = auth.user.name;
        // console.log("2.---------------", auth.user, nextUrl);
        // return Response.redirect(new URL('/dashboard', nextUrl));
         return true;
      }
      
      // return false;
    },
  },
  providers: [], // Add providers with an empty array for now
  session: {
    maxAge: 60*60*12,
    strategy: "jwt"
  } 
} satisfies NextAuthConfig;
