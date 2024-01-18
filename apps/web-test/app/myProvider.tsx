import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"

export default async function AuthContext({children}: { children: React.ReactNode }) {

    const session = await auth();
  // .. code
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
