import { RangeValueType } from '@/app/models/rangeModels';

type RangeLabelsProps = Readonly<{
  min: number;
  max: number;
  values: RangeValueType;
  stepMode: boolean | undefined;
  changeValue: (value: RangeValueType) => void;
  children: React.ReactNode;
}>;

export const RangeLabels: React.FC<RangeLabelsProps> = ({
  min,
  max,
  values,
  stepMode = false,
  changeValue,
  children,
}) => {
  const handleStartInputChange = (inputValue: number) => {
    let newValue =
      inputValue < min
        ? min
        : inputValue > values.end
        ? values.end - 1
        : inputValue;
    changeValue({ ...values, start: newValue });
  };

  const handleEndInputChange = (inputValue: number) => {
    let newValue =
      inputValue < values.start
        ? values.start + 1
        : inputValue > max
        ? max
        : inputValue;
    changeValue({ ...values, end: newValue });
  };

  return (
    <div className="w-full flex">
      <div className="input-wrapper flex gap-1 mr-4 items-center">
        <input
          type="number"
          disabled={stepMode}
          className="custom-input"
          min={min}
          max={values.end - 1}
          value={values.start}
          onChange={(e) =>
            handleStartInputChange(e.currentTarget.valueAsNumber)
          }
          aria-label="start-range-input"
        />
        <span>&#8364;</span>
      </div>
      {children}
      <div className="input-wrapper flex gap-1 ml-3 items-center">
        <input
          type="number"
          disabled={stepMode}
          className="custom-input"
          min={values.start + 1}
          max={max}
          value={values.end}
          step={1}
          onChange={(e) => handleEndInputChange(e.currentTarget.valueAsNumber)}
          aria-label="end-range-input"
        />
        <span>&#8364;</span>
      </div>
    </div>
  );
};
