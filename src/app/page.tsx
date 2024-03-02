'use client';

import { Range, RangeValueType } from '@/components/Range';
import { useState } from 'react';

async function fetchRangeData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/randomMinMax`
  );
  const data = await response.json();
  return {
    start: Number(Math.round(data.min).toFixed(2)),
    end: Number(Math.round(data.max).toFixed(2)),
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<RangeValueType>({
    start: 1,
    end: 10,
  });

  if (isLoading) {
    fetchRangeData().then((data) => {
      setValue(data);
      setIsLoading(false);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Range
          min={1}
          max={100}
          value={value}
          onChange={(value: RangeValueType) => setValue(value)}
        />
      )}
    </main>
  );
}
