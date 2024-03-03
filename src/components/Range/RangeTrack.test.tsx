import React from 'react';
import { render } from '@testing-library/react';
import { RangeTrack, RangeTrackProps } from './RangeTrack';

describe('RangeTrack component', () => {
  it('renders with correct left and width', () => {
    const props: RangeTrackProps = {
      left: 50,
      width: 300,
    };

    const { getByTestId } = render(<RangeTrack {...props} />);

    const trackElement = getByTestId('range-track');
    expect(trackElement).toHaveStyle('left: 50px');
    expect(trackElement).toHaveStyle('width: 300px');
  });
});
