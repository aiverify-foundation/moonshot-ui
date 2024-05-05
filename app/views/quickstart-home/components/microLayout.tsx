type MicroLayoutProps = {
  maxWidth?: number;
  minWidth?: number;
  children: React.ReactNode[];
};

function MicroLayout({
  children,
  maxWidth = 1440,
  minWidth = 1024,
}: MicroLayoutProps) {
  return (
    <div className="flex p-11 h-screen justify-center items-start">
      <div
        className="flex flex-nowrap basis-[70%] max-w-[1440px] min-w-[1024px] h-full justify-between relative gap-[0.5%]"
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
