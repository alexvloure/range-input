'use client';

import { Range, RangeValueType } from '@/components/Range';
import { useState } from 'react';

async function fetchData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rangeMinMax`
  );
  const data = await response.json();
  return {
    start: Number(Math.round(data.min).toFixed(2)),
    end: Number(Math.round(data.max).toFixed(2)),
  };
}

async function fetchStepsData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rangeSteps`);
  const data = await response.json();
  return data.steps;
}

export default function Home() {
  const [isLoadingMinMax, setIsLoadingMinMax] = useState(true);
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const [value, setValue] = useState<RangeValueType>({ start: 0, end: 0 });
  const [stepValue, setStepValue] = useState<RangeValueType>({
    start: 0,
    end: 0,
  });
  const [steps, setSteps] = useState<number[]>([]);

  if (isLoadingMinMax && isLoadingSteps) {
    fetchData().then((data) => {
      setValue(data);
      setIsLoadingMinMax(false);
    });
    fetchStepsData().then((data) => {
      setStepValue({ start: data[0], end: data[5] });
      setSteps(data);
      setIsLoadingSteps(false);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-14">
      {isLoadingMinMax ? (
        <p>Retriving min and max values...</p>
      ) : (
        <Range
          value={value}
          onChange={(value: RangeValueType) => setValue(value)}
        />
      )}
      {isLoadingSteps ? (
        <p>Retrieving steps...</p>
      ) : (
        <Range
          value={stepValue}
          steps={steps}
          onChange={(value: RangeValueType) => setStepValue(value)}
        />
      )}
    </main>
  );
}
