import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { z } from 'zod';

//자격공급자 추가
import Credentials from 'next-auth/providers/credentials';

import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

import {postCall} from '@repo/kwe-lib/components/api.service.js'

async function getUser(email: string): Promise<User | undefined> {
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string(), password: z.string().min(6) })
            .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                // const user = await getUser(email);
                const param = {
                  url: "/login",
                  user_id:email,
                  password:password
                };
                const {data} = await postCall(param)

                if (!data.success) return null;
                // const passwordsMatch = await bcrypt.compare(password, user.password);

                console.log("user", data.success);

                // if (passwordsMatch) return user;
                return data;
            }

            console.log('Invalid credentials');
            return null;
        },
      }),
    ],
});