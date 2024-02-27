import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      user_id: string;
    } & DefaultSession['user']
    token?: string | null;
  }

  interface token {
      token: string | null;
  }

  interface JWT {
    uid: string;
  }
}

declare module 'next-auth/jwt/types' {
  interface JWT {
    uid: string;
  }
}