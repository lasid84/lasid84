//동적페이지 오류 관련 Export encountered errors on following paths:
export const dynamic = "force-dynamic";

// import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';

//구성요소 스트리밍
import CardWrapper from '@/app/ui/dashboard/cards';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
 
export default async function Page() {

  // 스트리밍으로 변경을 위한 주석 처리
  // const revenue = await fetchRevenue();
  //const latestInvoices = await fetchLatestInvoices();

  // waterfall -> Parellel 사용을 위한 주석처리
  // const totalPaidInvoices = (await fetchCardData()).totalPaidInvoices;
  // const totalPendingInvoices = (await fetchCardData()).totalPendingInvoices;
  // const numberOfInvoices = (await fetchCardData()).numberOfInvoices;
  // const numberOfCustomers = (await fetchCardData()).numberOfCustomers;
  // const {
  //     numberOfInvoices,
  //     numberOfCustomers,
  //     totalPaidInvoices,
  //     totalPendingInvoices,
  //   } = await fetchCardData();

  const latestInvoices: JSX.Element = await LatestInvoices();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">  
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> 
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
        <Suspense fallback={<CardsSkeleton />}>
          {/* @ts-expect-error Server Component */}
          <CardWrapper />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {/* <LatestInvoices /> */}
          {latestInvoices}
        </Suspense>
      </div>
    </main>
  );
}