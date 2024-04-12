import { request } from 'http';
import type { NextAuthConfig, Session } from 'next-auth';
import type { AdapterUser } from "@auth/core/adapters";
import type { JWT } from "@auth/core/jwt";
const {log} = require('@repo/kwe-lib/components/logHelper');
 
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  // trustHostedDomain: true,
  pages: {
    signIn: '/login',
    
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // log("authorized 시작", nextUrl)
      const isLoggedIn = !!auth?.user;
      const isLogInPage = nextUrl.pathname.startsWith('/login');

      // console.log("1.---------------", isLoggedIn, isLogInPage, auth, nextUrl);

      if (isLogInPage) {
        if (isLoggedIn) { 
          // console.log("1.5---------------", isLoggedIn, isLogInPage, auth, nextUrl);
          // return true;
          return Response.redirect(new URL('/', nextUrl));
          // return Response.redirect(new URL('/'));
        } 
        console.log("1.---------------", isLoggedIn, isLogInPage, auth, nextUrl);
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // nextUrl.username = auth.user.name;
        // console.log("2.---------------", auth.user, nextUrl);
        // return Response.redirect(new URL('/dashboard', nextUrl));
         return true;
      } else {
        console.log('==============isLoggedIn', isLoggedIn);
      }
      
      // return false;
    },
    //// session({session, token}: {session: Session; user?:AdapterUser; token?:JWT}) {
    // session({session, token}) {
    //   console.log(`Auth Sess = ${JSON.stringify(session)}`)
    //   console.log(`Auth Tok = ${JSON.stringify(token)}`)
    //   if (token?.jti) {
    //       session.token = token.jti // Put the provider's access token in the session so that we can access it client-side and server-side with `auth()`
    //   }
    //   console.log(`Auth Sess = ${JSON.stringify(session)}`)
    //   return session
    // },
    // async jwt({ token, user, account, profile }) {
    //   log("==========", token, " / ", user, account, profile);
    //   return {...token}
    // },
    // async session({session, token, user}) {
    //   session.user = token;
    //   log("==========session", session, token, " / ");
    //   return session;
    // }

    
    // async session({session, token}: {session: Session; user?:AdapterUser; token?:JWT}) {
      
    //   // console.log('session:', token, session);

    //   session = {
    //     ...session,
    //     token: token?.jti
    //   }
    
    //   return session;
    //   // return session;
    // },
  },
  providers: [], // Add providers with an empty array for now
  session: {
    maxAge: 60*60*24,
    // maxAge: 60,
    strategy: "jwt"
  } 
} satisfies NextAuthConfig;
