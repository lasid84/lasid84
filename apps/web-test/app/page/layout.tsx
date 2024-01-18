
import SideNav from '@/app/ui/dashboard/sidenav';
import LeftSidebar from '@/app/page-parts/left-sidebar/page';

const {log} = require('@repo/kwe-lib/components/logHelper');
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"

export default function Layout({ children }: { children: React.ReactNode }) 
  {

  return (      
      <div className="flex flex-col h-screen md:flex-row md:overflow-hidden">
        <div className="flex-none w-full md:w-64">
            <SideNav />
            {/* <LeftSidebar/> */}
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
  );
}