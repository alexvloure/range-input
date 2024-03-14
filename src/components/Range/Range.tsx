'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useRef, useState } from 'react';
import './rangeStyles.css';
import { RangeHandle } from './RangeComponents/RangeHandle';
import { RangeTrack } from './RangeComponents/RangeTrack';
import { RangeLabels } from './RangeComponents/RangeLabels';
import { RangeValueType } from '@/app/models/rangeModels';
import { useGetPosition } from './hooks/useGetPosition';
import { useDrag } from './hooks/useDrag';
import { isTouchDevice } from './utils/isTouch';

type RangeProps = Readonly<{
  value: RangeValueType;
  /**
   * The steps for the range. If not provided, the range will be continuous.
   */
  steps?: number[];
  onChange: (value: RangeValueType) => void;
  width?: number;
}>;

export const Range: React.FC<RangeProps> = ({
  value,
  steps,
  onChange,
  width = 240,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const startValueRef = useRef<number>(value.start);
  const endValueRef = useRef<number>(value.end);
  const minVal = useRef<number>(value.start);
  const maxVal = useRef<number>(value.end);
  const valueRange = maxVal.current - minVal.current;
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const startValueHandleRef = useRef<HTMLDivElement | null>(null);
  const endValueHandleRef = useRef<HTMLDivElement | null>(null);
  // Set the value, assuring that it is between the min and max values
  const [values, setValues] = useState<RangeValueType>({
    start: value.start,
    end: value.end,
  });

  /**
   * Update both the range value and the value reference
   * @param value The new value of the range
   */
  const changeValue = (value: RangeValueType) => {
    onChange(value);
    setValues(value);
  };

  const { getHandlePosition, getTrackPosition } = useGetPosition({
    minVal,
    valueRange,
    values,
    width,
    steps,
  });

  const { startDrag } = useDrag({
    sliderRef,
    minVal,
    valueRange,
    steps,
    startValueRef,
    endValueRef,
    changeValue,
  });

  useLayoutEffect(() => {
    if (
      startValueHandleRef.current === null ||
      endValueHandleRef.current === null
    )
      return;
    const startValueHandle = startValueHandleRef.current;
    const endValueHandle = endValueHandleRef.current;

    startValueHandle.addEventListener(
      isTouchDevice() ? 'touchstart' : 'mousedown',
      () => startDrag(nodeRef, startValueHandle)
    );
    endValueHandle.addEventListener(
      isTouchDevice() ? 'touchstart' : 'mousedown',
      () => startDrag(nodeRef, endValueHandle)
    );

    return () => {
      startValueHandle.removeEventListener(
        isTouchDevice() ? 'touchstart' : 'mousedown',
        () => startDrag(nodeRef, startValueHandle)
      );
      endValueHandle.removeEventListener(
        isTouchDevice() ? 'touchstart' : 'mousedown',
        () => startDrag(nodeRef, endValueHandle)
      );
    };
  }, []);

  return (
    <div
      ref={nodeRef}
      data-testid="range"
      className="flex flex-col items-center gap-6">
      <RangeLabels
        min={minVal.current}
        max={maxVal.current}
        values={values}
        stepMode={steps && steps.length > 0}
        changeValue={changeValue}>
        <div className="h-10 w-full flex items-center">
          <div
            data-testid="slider"
            ref={sliderRef}
            style={{ width }}
            className="slider relative h-[2px] bg-gray-500">
            <RangeHandle
              id="startValueHandle"
              handleRef={startValueHandleRef}
              position={getHandlePosition(values.start, true)}
            />
            <RangeHandle
              id="endValueHandle"
              handleRef={endValueHandleRef}
              isStart={false}
              position={getHandlePosition(values.end, false)}
            />
            <RangeTrack
              left={getTrackPosition().left}
              width={getTrackPosition().width}
            />
          </div>
        </div>
      </RangeLabels>
    </div>
  );
};
