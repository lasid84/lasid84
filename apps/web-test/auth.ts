import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { z } from 'zod';

//자격공급자 추가
import Credentials from 'next-auth/providers/credentials';

import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

const {postCall, executFunction} = require('@repo/kwe-lib/components/api.service.js');
const {log} = require('@repo/kwe-lib/components/logHelper');
import { useStore } from "@/app/utils/zustand";
import { useUserSettings } from "@/app/states/useUserSettings";
import { UserState } from "@/app/store/userStore";

// async function getUser(data: any): Promise<User | undefined> {
  async function getUser(data : any) {
    try {
        
        log("start getUserData", data)
      // const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;        

        const inparam = ["in_user_id", "in_user_nm", "in_ipaddr"];
        const invalue = [data.user_id, data.user_nm, data.ipaddr];
        const inproc = 'public.f_admn_get_userauth'; 
        const cursorData = await executFunction(inproc,inparam, invalue);    
        log("cursorData", cursorData[0]);
        const userData = cursorData[0];

        UserState.setState(userData[0]);
        log("auth의 getUser 끝", useUserSettings.getState().data);


        // const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
      // //  log("login-form:: res.user =====> ", JSON.stringify(user.user_id), data.user_nm);
      //  userSettingsActions!.setData({ user_id: userData[0].user_id });
      //  userSettingsActions!.setData({ user_name: userData[0].user_nm });
      //  userSettingsActions!.setData({ permission_id: userData[0].permission_id });
      //  userSettingsActions!.setData({ user_grp_id: userData[0].user_grp_id });
      //  userSettingsActions!.setData({ office_cd: userData[0].office_cd });
      //  userSettingsActions!.setData({ dept_cd: userData[0].dept_cd });
      //  userSettingsActions!.setData({ trans_mode: userData[0].trans_mode });
      //  userSettingsActions!.setData({ trans_type: userData[0].trans_type });

      //  //ip 추가
      //  userSettingsActions!.setData({ ufs_id: userData[0].ufs_id });
      return userData;

    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }
 
export const { handlers, auth, signIn, signOut } = NextAuth({
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
                
                const userData:any = await getUser({user_id:email, user_nm :data.user_nm});
                // if (passwordsMatch) return user;
                return userData[0];
            }

            console.log('Invalid credentials');
            return null;
        },
      }),
    ],
    callbacks: {
      jwt: async ({ user, token }) => {
        // log("jwt0", user);
        if (user) {
          // token.uid = user.user_id;
          token = {
            ...token,
            ...user
          }
        }
        // log("jwt", user, token);
        return token;
      },
      async session({ session, token, user }) {
        session.user = {
          ...session.user,
          ...token
        }

        // log("seesion0", user, session);
        return session      
      }
    },
    // session: {
    //   strategy: 'jwt',
    // },
});