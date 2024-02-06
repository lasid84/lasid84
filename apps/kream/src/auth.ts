
import NextAuth, {Session} from 'next-auth';
import { Auth } from "@auth/core"
import { authConfig } from './auth.config';
import { JWT } from '@auth/core/jwt';
import { z } from 'zod';

//자격공급자 추가
import Credentials from 'next-auth/providers/credentials';
import { setUserSetting, useUserSettings } from "states/useUserSettings";

// import { sql } from '@vercel/postgres';
// import type { User } from '@/app/lib/definitions';
// import bcrypt from 'bcrypt';

const {postCall, executFunction} = require('@repo/kwe-lib/components/api.service.js');
const {log} = require('@repo/kwe-lib/components/logHelper');

const getUser = (async ({user_id, user_nm}:{user_id:string, user_nm:string}) => {
  try {
      // update();
      console.log("=====================start getUserData", user_id, user_nm);
      // const user_id = await session?.user.email;
      // const user_nm = await session?.user.name;

      const inparam = ["in_user_id", "in_user_nm", "in_ipaddr"];
      // const invalue = [data.user_id, data.user_nm, data.ipaddr];
      const invalue = [user_id, user_nm, ''];
      const inproc = 'public.f_admn_get_userauth'; 
      const cursorData = await executFunction(inproc,inparam, invalue);  
      
      console.log("========================cursorData", cursorData);
      if (cursorData !== null) {   
          return cursorData[0];
      }           
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {

  };
});
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({           
      async authorize(credentials) {
          log("authorize 시작");

          const parsedCredentials = z
            // .object({ user_id: z.string(), password: z.string().min(6) })
            .object({ user_id: z.string(), user_nm: z.string() })
            .safeParse(credentials);

            log("auth", parsedCredentials.success, credentials);

            if (parsedCredentials.success) {
                // const { user_id, password } = parsedCredentials.data;
                const { user_id, user_nm } = parsedCredentials.data;
                // const user = await getUser(email);
                // const param = {
                //   url: "/login",
                //   user_id:user_id,
                //   password:password
                // };

                // log("auth의 signIn", param);

                // const {data} = await postCall(param)

                // // if (!data.success) return null;

                // if (!data.success) {
                //   console.log(JSON.stringify(data));
                //   throw new Error("made by stephen : "+data.message);
                //   // return { error: data.message };
                // }

                // const passwordsMatch = await bcrypt.compare(password, user.password);
                
                // const userData:any = await getUser({user_id:user_id, user_nm :data.user_nm});
                // await setUserSetting({...userData[0]});

                // console.log("auth last:", useUserSettings.getState().data);
                
                // if (passwordsMatch) return user;

                // return userData[0];
                return {
                  id:user_id,
                  email:user_id,
                  name:user_nm,
                  ...credentials
                }
            }

            console.log('Invalid credentials', parsedCredentials.error.issues[0].message);
            return null;
        },
      }),
    ],
    callbacks: {
      // async signIn({ user, account, profile, email, credentials }) 
      // {
      //   console.log("------sign iin", user.error, user/*, account, profile, email, credentials*/);
      //   if(user?.error) {
      //     throw new Error('custom error to the client')
      //   }
      //   return false;
      // },  
      jwt: async ({ user, token }) => {
        // log("jwt0", user);
        if (user) {
          // const userData = await getUserData({user_id:user.email!, user_nm:user.name!})
          // // token.uid = user.user_id;
          // console.log("jwt", userData);
          token = {
            ...token,
            ...user
          }
        }
        // log("jwt", user, token);
        return token;
      },
      async session({session, token}) {
        session.user = {
          ...session.user,
          ...token
        }

        // log("seesion0", session);
        return session;      
      }
    },
    // session: {
    //   strategy: 'jwt',
    // },
});