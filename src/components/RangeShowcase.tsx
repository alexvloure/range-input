import { RangeValueType } from '@/app/models/rangeModels';
import { Range } from './Range';

type RangeShowcaseProps = Readonly<{
  value: RangeValueType;
  setValue: (value: RangeValueType) => void;
  stepValue: RangeValueType;
  setStepValue: (value: RangeValueType) => void;
  steps: number[];
}>;

export default function RangeShowcase({
  value,
  setValue,
  stepValue,
  setStepValue,
  steps,
}: RangeShowcaseProps) {
  return (
    <>
      <Range
        value={value}
        onChange={(value: RangeValueType) => setValue(value)}
      />
      <Range
        value={stepValue}
        steps={steps}
        onChange={(value: RangeValueType) => setStepValue(value)}
      />
    </>
  );
}
