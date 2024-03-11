'use client';

import { useMinMax } from '@/hooks/useMinMax';
import { useSteps } from '@/hooks/useSteps';
import { useEffect, useState } from 'react';
import { RangeValueType } from './models/rangeModels';
import RangeShowcase from '@/components/RangeShowcase';

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

  if (isLoadingMinMax || isLoadingSteps) {
    return <p>Loading...</p>;
  }

  if (!value || !stepValue || !steps) {
    return <p>Error: unable to retrieve data. Try again later.</p>;
  }

  return (
    <RangeShowcase
      value={value}
      setValue={setValue}
      stepValue={stepValue}
      setStepValue={setStepValue}
      steps={steps}
    />
  );
}
