import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

import Image from 'next/image'

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white w-30`}
    >
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]"></p> */}
      <Image
          className="h-23 w-80"
          width={800}
          height={400}
          src="/kwe_logo.png"
          alt="Picture of the author"
        />
    </div>
  );
}
