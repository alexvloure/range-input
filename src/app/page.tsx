'use client';

import { useMinMax } from '@/hooks/useMinMax';
import { useSteps } from '@/hooks/useSteps';
import { useEffect, useState } from 'react';
import { RangeValueType } from './models/rangeModels';
import { Range } from '@/components/Range';

export default function Home() {
  const { data: minMax, isLoading: isLoadingMinMax } = useMinMax();
  const [value, setValue] = useState<RangeValueType | null>(null);
  const { data: steps, isLoading: isLoadingSteps } = useSteps();
  const [stepValue, setStepValue] = useState<RangeValueType | null>(null);

  useEffect(() => {
    if (minMax) {
      setValue({ start: minMax.min, end: minMax.max });
    }
  }, [minMax]);

  useEffect(() => {
    if (steps && steps.length > 0) {
      setStepValue({ start: steps[0], end: steps[5] });
    }
  }, [steps]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-14">
      {isLoadingMinMax || !value ? (
        <p>Retriving min and max values...</p>
      ) : (
        <Range
          value={value}
          onChange={(value: RangeValueType) => setValue(value)}
        />
      )}
      {isLoadingSteps || !stepValue || !steps ? (
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
