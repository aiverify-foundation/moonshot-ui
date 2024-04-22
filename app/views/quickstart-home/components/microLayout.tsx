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
    <div className="flex border border-slate-500 p-11 pt-[4%] h-screen justify-center items-start">
      <div
        className="flex flex-nowrap basis-[70%] max-w-[1440px] min-w-[1024px] justify-between relative gap-[0.5%]"
        style={{ maxWidth, minWidth }}>
        <div
          id="navContainer"
          className="after:absolute after:top-0 after:left-0 after:bg-slate-500 basis-[9.5%]">
          {children[0]}
        </div>
        <div className="basis-[90%]">
          <div className="col-span-3">{children[1]}</div>
          <div className="col-span-3">{children[2]}</div>
        </div>
      </div>
    </div>
  );
}

export { MicroLayout };
