import { RangeValueType } from '@/app/models/rangeModels';

type useGetPositionProps = {
  minVal: React.MutableRefObject<number>;
  valueRange: number;
  values: RangeValueType;
  width: number;
  steps?: number[];
};

export const useGetPosition = ({
  minVal,
  valueRange,
  values,
  width,
  steps,
}: useGetPositionProps) => {
  /**
   * Get the position of the handle.
   * If the range is in step mode, the value will be the closest step.
   * @param value The value of the handle
   * @param isStart If the handle is the start handle
   * @returns
   */
  const getHandlePosition = (value: number, isStart: boolean) => {
    const handleWidth = 13;
    if (steps && steps.length > 0) {
      const step = steps!.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
      value = step;
    }
    const percentage = ((value - minVal.current) / valueRange) * 100;
    return isStart
      ? (percentage / 100) * width - handleWidth
      : width - (percentage / 100) * width - handleWidth;
  };

  /**
   * Get the position and width of the track
   */
  const getTrackPosition = () => {
    const start = getHandlePosition(values.start, true);
    const end = getHandlePosition(values.end, false);
    return { left: start + 3, width: width - end - start - 6 };
  };

  return {
    getHandlePosition,
    getTrackPosition,
  };
};
