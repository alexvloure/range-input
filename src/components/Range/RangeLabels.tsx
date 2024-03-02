import { RangeValueType } from '.';

type RangeLabelsProps = Readonly<{
  min: number;
  max: number;
  value: RangeValueType;
  changeValue: (value: RangeValueType) => void;
}>;

export const RangeLabels: React.FC<RangeLabelsProps> = ({
  min,
  max,
  value,
  changeValue,
}) => {
  return (
    <div className="w-full flex justify-between relative">
      <div className="flex gap-1 ml-[-25px] absolute top-0 left-0">
        <input
          type="number"
          className="custom-input min-w-14"
          min={min}
          max={value.end - 1}
          value={Math.round(value.start).toFixed(2)}
          onChange={(e) =>
            changeValue({
              start: e.currentTarget.valueAsNumber,
              end: value.end,
            })
          }
          aria-label="start-range-input"
        />
        <span>&#8364;</span>
      </div>
      <div className="flex gap-1 mr-[-10px] absolute top-0 right-0">
        <input
          type="number"
          className="custom-input min-w-14"
          min={value.start + 1}
          max={max}
          value={Math.round(value.end).toFixed(2)}
          step={1}
          onChange={(e) =>
            changeValue({
              start: value.start,
              end: e.currentTarget.valueAsNumber,
            })
          }
          aria-label="end-range-input"
        />
        <span>&#8364;</span>
      </div>
    </div>
  );
};
