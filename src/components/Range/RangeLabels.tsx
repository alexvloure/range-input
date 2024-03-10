import { RangeValueType } from '@/app/models/rangeModels';

type RangeLabelsProps = Readonly<{
  min: number;
  max: number;
  value: RangeValueType;
  stepMode: boolean | undefined;
  changeValue: (value: RangeValueType) => void;
  children: React.ReactNode;
}>;

export const RangeLabels: React.FC<RangeLabelsProps> = ({
  min,
  max,
  value,
  stepMode = false,
  changeValue,
  children,
}) => {
  const handleStartInputChange = (inputValue: number) => {
    let newValue =
      inputValue < min
        ? min
        : inputValue > value.end
        ? value.end - 1
        : inputValue;
    changeValue({ ...value, start: newValue });
  };

  const handleEndInputChange = (inputValue: number) => {
    let newValue =
      inputValue < value.start
        ? value.start + 1
        : inputValue > max
        ? max
        : inputValue;
    changeValue({ ...value, end: newValue });
  };

  return (
    <div className="w-full flex">
      <div className="input-wrapper flex gap-1 mr-4 items-center">
        <input
          type="number"
          disabled={stepMode}
          className="custom-input"
          min={min}
          max={value.end - 1}
          value={value.start}
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
          min={value.start + 1}
          max={max}
          value={value.end}
          step={1}
          onChange={(e) => handleEndInputChange(e.currentTarget.valueAsNumber)}
          aria-label="end-range-input"
        />
        <span>&#8364;</span>
      </div>
    </div>
  );
};
