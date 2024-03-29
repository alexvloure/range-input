'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useRef, useState } from 'react';
import './rangeStyles.css';
import { RangeHandle } from './RangeHandle';
import { RangeTrack } from './RangeTrack';
import { RangeLabels } from './RangeLabels';
import { RangeValueType } from '@/app/models/rangeModels';

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
  const stepMode = steps && steps.length > 0;
  // Set the value, assuring that it is between the min and max values
  const [rangeValue, setRangeValue] = useState<RangeValueType>({
    start: value.start,
    end: value.end,
  });

  /**
   * Update both the range value and the value reference
   * @param value The new value of the range
   */
  const changeValue = (value: RangeValueType) => {
    onChange(value);
    setRangeValue(value);
  };

  /**
   * Get the position of the handle.
   * If the range is in step mode, the value will be the closest step.
   * @param value The value of the handle
   * @param isStart If the handle is the start handle
   * @returns
   */
  const getHandlePosition = (value: number, isStart: boolean) => {
    const handleWidth = 13;
    if (stepMode) {
      const step = steps.reduce((prev, curr) =>
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
    const start = getHandlePosition(rangeValue.start, true);
    const end = getHandlePosition(rangeValue.end, false);
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
    startValueHandle.addEventListener('touchstart', () =>
      startDrag(startValueHandle)
    );
    endValueHandle.addEventListener('mousedown', () =>
      startDrag(endValueHandle)
    );
    endValueHandle.addEventListener('touchstart', () =>
      startDrag(endValueHandle)
    );

    function startDrag(handle: HTMLElement) {
      const document = nodeRef.current?.ownerDocument || window.document;
      const mouseDragHandler = (e: MouseEvent) => drag(e, handle);
      const touchDragHandler = (ev: TouchEvent) => drag(ev, handle);

      const endDragHandler = () => {
        document.removeEventListener('mousemove', mouseDragHandler);
        document.removeEventListener('touchmove', touchDragHandler);
        document.removeEventListener('mouseup', endDragHandler);
        document.removeEventListener('touchend', endDragHandler);
      };

      document.addEventListener('mousemove', mouseDragHandler);
      document.addEventListener('touchmove', touchDragHandler);
      document.addEventListener('mouseup', endDragHandler);
      document.addEventListener('touchend', endDragHandler);
    }

    /**
     * Calculate the new value of the range.
     * If the range is in step mode, the value will be the closest step.
     * @param e
     * @param handler
     */
    function drag(e: MouseEvent | TouchEvent, handler: HTMLElement) {
      const slider = sliderRef.current!.getBoundingClientRect();
      const isStart = handler.id === 'startValueHandle';
      const handleAdjustment = isStart ? 4 : -4;

      let newX;
      if (e instanceof MouseEvent) {
        newX = e.clientX - slider.left + handleAdjustment;
      } else {
        newX = e.touches[0].clientX - slider.left + handleAdjustment;
      }
      newX = Math.max(0, Math.min(newX, slider.width));

      const percentage = (newX / slider.width) * 100;
      let newValue = Math.round(
        minVal.current + (percentage / 100) * valueRange
      );

      if (stepMode) {
        newValue = steps.reduce((prev, curr) =>
          Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
        );
      }

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
    <div
      ref={nodeRef}
      data-testid="range"
      className="flex flex-col items-center gap-6">
      <RangeLabels
        min={minVal.current}
        max={maxVal.current}
        value={rangeValue}
        stepMode={stepMode}
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
              position={getHandlePosition(rangeValue.start, true)}
            />
            <RangeHandle
              id="endValueHandle"
              handleRef={endValueHandleRef}
              isStart={false}
              position={getHandlePosition(rangeValue.end, false)}
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
