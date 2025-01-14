
import NextAuth, { DefaultSession, Session } from 'next-auth';
import { authConfig } from './auth.config';
import { z } from 'zod';

//자격공급자 추가
import Credentials from 'next-auth/providers/credentials';
// const {postCall, executFunction} = require('@repo/kwe-lib/components/api.service.js');
import { log, error } from '@repo/kwe-lib-new';
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({           
      async authorize(credentials) {
          // log("authorize 시작");

          const parsedCredentials = z
            // .object({ user_id: z.string(), password: z.string().min(6) })
            .object({ user_id: z.string(), user_nm: z.string() })
            .safeParse(credentials);

            // log("=====auth", parsedCredentials.success, credentials);

            if (parsedCredentials.success) {
                // const { user_id, password } = parsedCredentials.data;
                const { user_id, user_nm } = parsedCredentials.data;

                return {
                  id:user_id,
                  email:user_id,
                  name:user_nm
                }
            }

            // log('Invalid credentials', parsedCredentials.error.issues[0].message);
            return null;
        },
      }),
    ],
    callbacks: {  
    },
});