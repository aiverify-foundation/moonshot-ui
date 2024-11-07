type MicroLayoutProps = {
  maxWidth?: number;
  minWidth?: number;
  children: React.ReactNode[];
};

const MAX_WIDTH = 1440;
const MIN_WIDTH = 900;

function MicroLayout({
  children,
  maxWidth = MAX_WIDTH,
  minWidth = MIN_WIDTH,
}: MicroLayoutProps) {
  return (
    <div className="flex p-11 h-[800px] justify-center items-start">
      <div
        className="flex flex-nowrap basis-[70%] h-full justify-between relative gap-[0.5%]"
        style={{ maxWidth, minWidth }}>
        <div
          id="navContainer"
          className="basis-[7.5%]">
          {children[0]}
        </div>
        <div className="basis-[92%]">
          <div className="col-span-3">{children[1]}</div>
          <div
            className="col-span-3"
            style={{ height: 'calc(100% - 70px)' }}>
            {children[2]}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MicroLayout };
