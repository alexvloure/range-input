/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import './rangeStyles.css';
import { RangeHandle } from './RangeHandle';
import { RangeTrack } from './RangeTrack';
import { RangeLabels } from './RangeLabels';

export type RangeValueType = {
  start: number;
  end: number;
};

type RangeProps = Readonly<{
  min: number;
  max: number;
  value: RangeValueType;
  /**
   * The steps for the range. If not provided, the range will be continuous.
   */
  steps?: number[];
  onChange: (value: RangeValueType) => void;
  /**
   * The width of the range
   * @default 240px
   */
  width?: number;
  /**
   * Show the labels for the range
   * @default true
   */
  showLabels?: boolean;
}>;

export const Range: React.FC<RangeProps> = ({
  min,
  max,
  value,
  steps,
  onChange,
  width = 240,
  showLabels = true,
}) => {
  const startValueRef = useRef<number>(value.start);
  const endValueRef = useRef<number>(value.end);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const startValueHandleRef = useRef<HTMLDivElement | null>(null);
  const endValueHandleRef = useRef<HTMLDivElement | null>(null);
  const valueRange = max - min;
  // Set the value of the range, assuring that it is between the min and max values
  const [clampedValue, setClampedValue] = useState<RangeValueType>({
    start: value.start < min ? min : value.start > max ? min : value.start,
    end: value.end > max ? max : value.end < min ? max : value.end,
  });

  // Update value
  const changeValue = (value: RangeValueType) => {
    onChange(value);
    setClampedValue(value);
  };

  // Get the position of the handles
  const getHandlePosition = useCallback(
    (value: number, isStart: boolean) => {
      const handleWidth = 13;
      let clampedValue = Math.min(Math.max(value, min), max);
      const percentage = ((clampedValue - min) / valueRange) * 100;

      return isStart
        ? (percentage / 100) * width - handleWidth
        : width - (percentage / 100) * width - handleWidth;
    },
    [min, max, width, valueRange]
  );

  // Get the position of the track
  const getTrackPosition = () => {
    const start = getHandlePosition(clampedValue.start, true);
    const end = getHandlePosition(clampedValue.end, false);
    return { left: start + 3, width: width - end - start - 6 };
  };

  useLayoutEffect(() => {
    if (
      startValueHandleRef.current === null ||
      endValueHandleRef.current === null
    )
      return;
    const startValueHandle = startValueHandleRef.current;
    const endValueHandle = endValueHandleRef.current;

    startValueHandle.addEventListener('mousedown', () =>
      startDrag(startValueHandle)
    );
    endValueHandle.addEventListener('mousedown', () =>
      startDrag(endValueHandle)
    );

    function startDrag(handle: HTMLElement) {
      const dragHandler = (e: MouseEvent) => drag(e, handle);

      const endDragHandler = () => {
        window.removeEventListener('mousemove', dragHandler);
        window.removeEventListener('mouseup', endDragHandler);
      };

      window.addEventListener('mousemove', dragHandler);
      window.addEventListener('mouseup', endDragHandler);
    }

    // Calculate the new value of the range and the position of the handle
    function drag(e: MouseEvent, handler: HTMLElement) {
      const slider = sliderRef.current!.getBoundingClientRect();
      const isStart = handler.id === 'startValueHandle';
      const handleAdjustment = isStart ? 4 : -4;
      let newX = e.clientX - slider.left + handleAdjustment;
      newX = Math.max(0, Math.min(newX, slider.width));

      const percentage = (newX / slider.width) * 100;
      const newValue = min + (percentage / 100) * valueRange;
      if (isStart && Math.round(newValue) < Math.round(endValueRef.current)) {
        startValueRef.current = newValue;
        changeValue({ start: startValueRef.current, end: endValueRef.current });
      } else if (
        !isStart &&
        Math.round(newValue) > Math.round(startValueRef.current)
      ) {
        endValueRef.current = newValue;
        changeValue({ start: startValueRef.current, end: endValueRef.current });
      }
    }

    return () => {
      startValueHandle.removeEventListener('mousedown', () =>
        startDrag(startValueHandle)
      );
      endValueHandle.removeEventListener('mousedown', () =>
        startDrag(endValueHandle)
      );
    };
  }, []);

  return (
    <div data-testid="range" className="flex flex-col items-center gap-6">
      {showLabels && (
        <RangeLabels
          min={min}
          max={max}
          value={clampedValue}
          changeValue={changeValue}
        />
      )}
      <div className="h-10 w-full flex items-center">
        <div
          data-testid="slider"
          ref={sliderRef}
          style={{ width }}
          className="slider relative h-[2px] bg-gray-500">
          <RangeHandle
            id="startValueHandle"
            handleRef={startValueHandleRef}
            position={getHandlePosition(clampedValue.start, true)}
          />
          <RangeHandle
            id="endValueHandle"
            handleRef={endValueHandleRef}
            isStart={false}
            position={getHandlePosition(clampedValue.end, false)}
          />
          <RangeTrack
            left={getTrackPosition().left}
            width={getTrackPosition().width}
          />
        </div>
      </div>
    </div>
  );
};
