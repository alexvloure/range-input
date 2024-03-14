import React from 'react';
import { render } from '@testing-library/react';
import { RangeHandle, RangeHandleProps } from './RangeHandle';

describe('RangeHandle component', () => {
  const defaultProps: RangeHandleProps = {
    id: 'handleId',
    handleRef: {
      current: document.createElement('div'),
    } as React.RefObject<HTMLDivElement>,
    position: 50,
    isStart: true,
  };

  it('renders with default props', () => {
    const props = { ...defaultProps };

    const { getByTestId } = render(<RangeHandle {...props} />);

    const handleElement = getByTestId(props.id);
    expect(handleElement).toHaveStyle('left: 50px');
  });

  it('applies position to the right when isStart is false', () => {
    const props = { ...defaultProps, isStart: false, position: 80 };

    const { getByTestId } = render(<RangeHandle {...props} />);

    const handleElement = getByTestId(props.id);
    expect(handleElement).toHaveStyle('right: 80px');
  });
});
