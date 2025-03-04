import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
 
export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-full gap-2">
      {/* @ts-expect-error Server Component */}
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.12</p>
      {/* @ts-expect-error Server Component */}
      <Link
        href="/dashboard/invoices"
        className="px-4 py-2 mt-4 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}