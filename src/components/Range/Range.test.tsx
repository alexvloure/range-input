import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Range } from './Range';

describe('Range component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.getBoundingClientRect = function () {
      return {
        width: parseFloat(this.style.width) || 0,
        height: parseFloat(this.style.height) || 0,
        top: parseFloat(this.style.marginTop) || 0,
        left: parseFloat(this.style.marginLeft) || 0,
      } as DOMRect;
    };
  });

  it('renders with default values', () => {
    const { getByLabelText, getByTestId } = render(
      <Range value={{ start: 20, end: 80 }} onChange={() => {}} />
    );

    // Check if labels are rendered
    expect(getByLabelText('start-range-input')).toHaveValue(20);
    expect(getByLabelText('end-range-input')).toHaveValue(80);

    // Check if handles are rendered
    expect(getByTestId('startValueHandle')).toBeInTheDocument();
    expect(getByTestId('endValueHandle')).toBeInTheDocument();
  });
  it('renders with custom width', () => {
    const { getByTestId } = render(
      <Range value={{ start: 20, end: 80 }} onChange={() => {}} width={300} />
    );

    // Check if slider has the correct width
    expect(getByTestId('slider')).toHaveStyle('width: 300px');
  });
  it('handles user interaction correctly', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Range value={{ start: 20, end: 80 }} onChange={onChangeMock} />
    );

    const startValueHandle = getByTestId('startValueHandle');
    const endValueHandle = getByTestId('endValueHandle');

    fireEvent.mouseDown(startValueHandle);
    fireEvent.mouseMove(window.document, { clientX: 50 });
    fireEvent.mouseUp(startValueHandle);

    expect(onChangeMock).toHaveBeenCalledWith({
      start: expect.any(Number),
      end: expect.any(Number),
    });

    fireEvent.mouseDown(endValueHandle);
    fireEvent.mouseMove(window.document, { clientX: 90 });
    fireEvent.mouseUp(endValueHandle);

    expect(onChangeMock).toHaveBeenCalledWith({
      start: expect.any(Number),
      end: expect.any(Number),
    });
  });
  it('removes listeners on unmount', async () => {
    const { getByTestId, unmount } = render(
      <Range value={{ start: 20, end: 80 }} onChange={() => {}} />
    );

    const startValueHandle = getByTestId('startValueHandle');
    const endValueHandle = getByTestId('endValueHandle');

    const removeEventListenerStart = jest.spyOn(
      startValueHandle,
      'removeEventListener'
    );
    const removeEventListenerEnd = jest.spyOn(
      endValueHandle,
      'removeEventListener'
    );
    unmount();
    expect(removeEventListenerStart).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerEnd).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
  });
  it('allows to move only on steps if these are provided', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Range
        value={{ start: 20, end: 80 }}
        steps={[20, 40, 60, 80]}
        onChange={onChangeMock}
      />
    );

    const startValueHandle = getByTestId('startValueHandle');
    const endValueHandle = getByTestId('endValueHandle');

    fireEvent.mouseDown(startValueHandle);
    fireEvent.mouseMove(window.document, { clientX: 50 });
    fireEvent.mouseUp(startValueHandle);

    expect(onChangeMock).toHaveBeenCalledWith({ start: 40, end: 80 });

    fireEvent.mouseDown(endValueHandle);
    fireEvent.mouseMove(window.document, { clientX: 160 });
    fireEvent.mouseUp(endValueHandle);

    expect(onChangeMock).toHaveBeenCalledWith({ start: 40, end: 60 });
  });
});
