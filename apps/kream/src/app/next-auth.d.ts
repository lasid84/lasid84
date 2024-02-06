import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      user_id: string;
    } & DefaultSession['user'];
  }

  interface token {
      token: string | null;
  }
}

declare module 'next-auth/jwt/types' {
  interface JWT {
    uid: string;
  }
}