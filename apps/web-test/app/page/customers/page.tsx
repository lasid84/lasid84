//동적페이지 오류 관련 Export encountered errors on following paths:
export const dynamic = "force-dynamic";

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Customer',
};

export default function Page() {
    return <p>Customers Page</p>;
  }