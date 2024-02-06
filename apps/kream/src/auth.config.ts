import { request } from 'http';
import type { NextAuthConfig, Profile } from 'next-auth';
const {log} = require('@repo/kwe-lib/components/logHelper');
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // async signIn(user) {
    //   console.log("---------------signin", user);
    //   // return user.userId;
    //   return user;
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
      log("authorized 시작")
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isLogInPage = nextUrl.pathname.startsWith('/login');

      console.log("1.---------------", isLoggedIn, isOnDashboard, auth);

      // if (isOnDashboard) {
      //   if (isLoggedIn) { 
      //     console.log("1.5---------------", isLoggedIn, isOnDashboard, auth, nextUrl);
      //     return true;
      //   };
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   nextUrl.username = auth.user.name;
      //   console.log("2.---------------", auth.user, nextUrl);
      //   // return Response.redirect(new URL('/dashboard', nextUrl));
      //    return true;
      // }

      if (isLogInPage) {
        if (isLoggedIn) { 
          console.log("1.5---------------", isLoggedIn, isLogInPage, auth, nextUrl);
          // return true;
          return Response.redirect(new URL('/', nextUrl));
        };
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        nextUrl.username = auth.user.name;
        console.log("2.---------------", auth.user, nextUrl);
        // return Response.redirect(new URL('/dashboard', nextUrl));
         return true;
      }
      
      // return false;
    },
    // async signIn({ user, account, profile, email, credentials }) 
    //   {
    //     console.log("=============sign iin", user.error);
    //     if(user.error) {
    //       throw new Error('custom error to the client')
    //     }
    //     return false;
    //   },  
  },
  providers: [], // Add providers with an empty array for now
  session: {
    maxAge: 60*60,
    strategy: "jwt"
  } 
} satisfies NextAuthConfig;
