export type RangeTrackProps = Readonly<{
  /**
   * The left position of the track
   */
  left: number;
  /**
   * The width of the track
   */
  width: number;
}>;

export const RangeTrack: React.FC<RangeTrackProps> = ({ left, width }) => {
  return (
    <div
      data-testid="range-track"
      className="absolute h-full bg-white"
      style={{
        left,
        width,
      }}
    />
  );
};
