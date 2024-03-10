export type RangeHandleProps = Readonly<{
  id: string;
  handleRef: React.RefObject<HTMLDivElement>;
  /**
   * If the handle is the start one or the end one of the range
   * @default true
   */
  isStart?: boolean;
  /**
   * The position of the handle. If isStart is true, the position is the left position, otherwise is the right position.
   */
  position: number;
}>;

export const RangeHandle: React.FC<RangeHandleProps> = ({
  id,
  handleRef,
  isStart = true,
  position,
}: RangeHandleProps) => {
  return (
    <div
      id={id}
      data-testid={id}
      ref={handleRef}
      className="absolute top-[-0.5rem] p-[3px] z-10 flex justify-center items-center hover:cursor-grab hover:scale-125 active:cursor-grabbing active:scale-125"
      style={isStart ? { left: position } : { right: position }}>
      <div className="h-3 w-3 rounded-full bg-[rgb(var(--foreground-rgb))]" />
    </div>
  );
};
