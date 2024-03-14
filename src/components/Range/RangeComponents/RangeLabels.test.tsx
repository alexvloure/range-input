import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RangeLabels } from './RangeLabels';
import { RangeValueType } from '@/app/models/rangeModels';

describe('RangeLabels component', () => {
  const defaultProps = {
    min: 0,
    max: 100,
    stepMode: false,
    values: { start: 20, end: 80 } as RangeValueType,
    changeValue: jest.fn(),
  };

  it('renders with default props', () => {
    const props = { ...defaultProps };

    const { getByLabelText } = render(
      <RangeLabels {...props}>
        <></>
      </RangeLabels>
    );

    expect(getByLabelText('start-range-input')).toBeInTheDocument();
    expect(getByLabelText('end-range-input')).toBeInTheDocument();
  });

  it('renders input fields with correct attributes and values', () => {
    const props = { ...defaultProps };

    const { getByLabelText } = render(
      <RangeLabels {...props}>
        <></>
      </RangeLabels>
    );
    const startInput = getByLabelText('start-range-input') as HTMLInputElement;
    const endInput = getByLabelText('end-range-input') as HTMLInputElement;

    expect(startInput).toHaveAttribute('min', '0');
    expect(startInput).toHaveAttribute('max', '79');
    expect(startInput).toHaveValue(20);
    expect(endInput).toHaveAttribute('min', '21');
    expect(endInput).toHaveAttribute('max', '100');
    expect(endInput).toHaveValue(80);
  });

  it('calls changeValue with correct parameters when input values change', () => {
    const props = { ...defaultProps };
    const { getByLabelText } = render(
      <RangeLabels {...props}>
        <></>
      </RangeLabels>
    );
    const startInput = getByLabelText('start-range-input') as HTMLInputElement;
    const endInput = getByLabelText('end-range-input') as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: 30 } });
    fireEvent.change(endInput, { target: { value: 90 } });

    expect(props.changeValue).toHaveBeenCalledWith({ start: 30, end: 80 });
    expect(props.changeValue).toHaveBeenCalledWith({ start: 20, end: 90 });
  });
});
