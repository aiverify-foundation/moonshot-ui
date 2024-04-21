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
    <div className="flex border border-slate-500 p-11 pt-[7%] h-screen justify-center items-start">
      <div
        className="flex flex-nowrap basis-[70%] max-w-[1440px] min-w-[1024px] justify-between relative gap-[0.5%]"
        style={{ maxWidth, minWidth }}>
        <div
          id="navContainer"
          className="after:absolute after:top-0 after:left-0 after:bg-slate-500 border border-fuchsia-700 basis-[9.5%]">
          {children[0]}
        </div>
        <div className="basis-[90%] grid grid-cols-2 grid-rows-[4rem, 1fr] gap-2">
          <div
            id="headerContainer"
            className="col-span-3">
            {children[1]}
          </div>
          <div
            id="mainContainer"
            className="col-span-3">
            {children[2]}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MicroLayout };
