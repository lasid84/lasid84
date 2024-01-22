import { request } from 'http';
import type { NextAuthConfig } from 'next-auth';
const {log} = require('@repo/kwe-lib/components/logHelper');
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // async signIn(user) {
    //   console.log("---------------signin", user,);
    //   return user.userId;
    // },
    // async session({session, token}) {
    //   session.user = token.sub;
    //   console.log("---------------session", session, token.name);
    //   return session;
    // },
    // async jwt({token, user}) {
    //   console.log("---------------jwt", user, token);
    //   if (user) token.user = user;
    //   return token;
    // },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/page');

      if (isOnDashboard) {
        if (isLoggedIn) { return true };
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // console.log("2.---------------", auth.user, nextUrl);
        nextUrl.username = auth.user;
        return Response.redirect(new URL('/page', nextUrl));
        //  return true;
      }
      return true;
    },
    // session: async ({ session, token, user }) => {
    //   if (session?.user) {
    //     session.user.id = token.uid;
    //   }
    //   // log("session", session, token, user);
    //   return session;
    // }
  },
  providers: [], // Add providers with an empty array for now
  session: {
    maxAge: 60,
  }
} satisfies NextAuthConfig;
