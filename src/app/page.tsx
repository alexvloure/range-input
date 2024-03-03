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

async function fetchStepsData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/randomSteps`
  );
  const data = await response.json();
  return data;
}

export default function Home() {
  const [isLoadingMinMax, setIsLoadingMinMax] = useState(true);
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const [value, setValue] = useState<RangeValueType>({ start: 0, end: 0 });
  const [steps, setSteps] = useState<number[]>([]);

  if (isLoadingMinMax) {
    fetchRangeData().then((data) => {
      setValue(data);
      setIsLoadingMinMax(false);
    });
  }

  if (isLoadingSteps) {
    fetchStepsData().then((data) => {
      console.log(data);
      setIsLoadingSteps(false);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-14">
      {isLoadingMinMax ? (
        <p>Loading continuous range slider...</p>
      ) : (
        <Range
          min={1}
          max={100}
          value={value}
          onChange={(value: RangeValueType) => setValue(value)}
        />
      )}
      {isLoadingSteps ? (
        <p>Loading steps range slider...</p>
      ) : (
        <Range
          min={1}
          max={100}
          value={{ start: 1, end: 100 }}
          steps={steps}
          onChange={(value: RangeValueType) => setValue(value)}
        />
      )}
    </main>
  );
}
