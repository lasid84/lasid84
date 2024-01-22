import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "page-parts/com/login/login.query";

export default NextAuth({
    secret : process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                user_id: { label: "Username", type: "text", placeholder: "ID를 입력하세요" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                // const res = await fetch('/login',{
                //     method : "POST",
                //     headers:{
                //         "Content-Type" : "application/json",
                //     },
                //     body : JSON.stringify({
                //         user_id : credentials?.user_id,
                //         password: credentials?.password,
                //     }),
                // });
                // const user = await res.json();

                const res = await loginUser({
                    user_id: req.body.user_id,
                    password: req.body.password
                });
                const { data } = await res

                if (data) {
                    return data
                } else {
                    console.log('log123', data)
                    return null
                    // You can also Reject this callback with an Error or with a URL:
                    // throw new Error("error message") // Redirect to error page
                    // throw "/path/to/redirect"        // Redirect to a URL
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },

        async session({ session, token }) {
            session.user = token as any;
            return session
        }
    },
    session: {
        maxAge: 60,
      },
    pages: {
        signIn: "/login",
    }
})