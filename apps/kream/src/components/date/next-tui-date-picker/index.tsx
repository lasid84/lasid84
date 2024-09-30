'use client';

import { TuiDatePicker } from 'nextjs-tui-date-picker';

export default function Page() {
  return (
    <>
      <TuiDatePicker
        handleChange={() => {}}
        date={new Date('2023-01-01')}
        inputWidth={140}
        fontSize={16}
        // backgroundColor="#ff0000"
      />
    </>
  );
}