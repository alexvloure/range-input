import { RangeValueType } from '@/app/models/rangeModels';
import { isTouchDevice } from '../utils/isTouch';

type useDragProps = {
  sliderRef: React.RefObject<HTMLDivElement>;
  startValueRef: React.MutableRefObject<number>;
  endValueRef: React.MutableRefObject<number>;
  valueRange: number;
  minVal: React.MutableRefObject<number>;
  steps?: number[];
  changeValue: (value: RangeValueType) => void;
};

export const useDrag = ({
  sliderRef,
  startValueRef,
  endValueRef,
  minVal,
  valueRange,
  steps,
  changeValue,
}: useDragProps) => {
  const dragHandler = (e: MouseEvent | TouchEvent, handler: HTMLElement) => {
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
    let newValue = Math.round(minVal.current + (percentage / 100) * valueRange);

    if (steps && steps.length > 0) {
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
  };

  const startDrag = (
    nodeRef: React.RefObject<HTMLDivElement>,
    handler: HTMLElement
  ) => {
    const document = nodeRef.current?.ownerDocument || window.document;
    const dragHandlerFn = (e: MouseEvent | TouchEvent) =>
      dragHandler(e, handler);

    const endDragHandler = () => {
      document.removeEventListener(
        isTouchDevice() ? 'touchmove' : 'mousemove',
        dragHandlerFn
      );
      document.removeEventListener(
        isTouchDevice() ? 'touchend' : 'mouseup',
        endDragHandler
      );
    };

    document.addEventListener(
      isTouchDevice() ? 'touchmove' : 'mousemove',
      dragHandlerFn
    );
    document.addEventListener(
      isTouchDevice() ? 'touchend' : 'mouseup',
      endDragHandler
    );
  };

  return {
    startDrag,
  };
};
