import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Range } from '.';

describe('Range component', () => {
  it('renders with default values', () => {
    const { getByLabelText, getByTestId } = render(
      <Range
        min={0}
        max={100}
        value={{ start: 20, end: 80 }}
        onChange={() => {}}
      />
    );

    // Check if labels are rendered
    expect(getByLabelText('start-range-input')).toHaveValue(20);
    expect(getByLabelText('end-range-input')).toHaveValue(80);

    // Check if handles are rendered
    expect(getByTestId('startValueHandler')).toBeInTheDocument();
    expect(getByTestId('endValueHandler')).toBeInTheDocument();
  });
  it('renders without labels if showLabels is false', () => {
    const { queryByLabelText, getByTestId } = render(
      <Range
        min={0}
        max={100}
        value={{ start: 20, end: 80 }}
        onChange={() => {}}
        showLabels={false}
      />
    );

    // Check if labels are not rendered
    expect(queryByLabelText('start-range-input')).toBeNull();
    expect(queryByLabelText('end-range-input')).toBeNull();

    // Check if handles are rendered
    expect(getByTestId('startValueHandler')).toBeInTheDocument();
    expect(getByTestId('endValueHandler')).toBeInTheDocument();
  });
  it('renders with custom width', () => {
    const { getByTestId } = render(
      <Range
        min={0}
        max={100}
        value={{ start: 20, end: 80 }}
        onChange={() => {}}
        width={300}
      />
    );

    // Check if Range has the correct width
    expect(getByTestId('range')).toHaveStyle('width: 300px');
  });
  it('renders min and max values if the values provided are out of bounds', async () => {
    const { getByLabelText } = render(
      <Range
        min={0}
        max={100}
        value={{ start: -20, end: 200 }}
        onChange={() => {}}
      />
    );

    await waitFor(() => {
      // Check if labels are rendered with min and max values
      expect(getByLabelText('start-range-input')).toHaveValue(0);
      expect(getByLabelText('end-range-input')).toHaveValue(100);
    });
  });
  it('handles user interaction correctly', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Range
        min={0}
        max={100}
        value={{ start: 20, end: 80 }}
        onChange={onChangeMock}
      />
    );

    const startHandle = getByTestId('startValueHandler');
    const endHandle = getByTestId('endValueHandler');

    fireEvent.mouseDown(startHandle);
    fireEvent.mouseMove(startHandle, { clientX: 50 }); // Simulate dragging
    fireEvent.mouseUp(startHandle);

    expect(onChangeMock).toHaveBeenCalledWith({
      start: expect.any(Number),
      end: expect.any(Number),
    });

    fireEvent.mouseDown(endHandle);
    fireEvent.mouseMove(endHandle, { clientX: 150 }); // Simulate dragging beyond max value
    fireEvent.mouseUp(endHandle);

    // Ensure that onChange is called with corrected values
    expect(onChangeMock).toHaveBeenCalledWith({
      start: expect.any(Number),
      end: expect.any(Number),
    });

    // You can add more assertions based on your specific UI
  });
});
