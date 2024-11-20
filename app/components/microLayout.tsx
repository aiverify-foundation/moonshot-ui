import { MAX_LAYOUT_WIDTH, MIN_LAYOUT_WIDTH } from '@/app/constants';

type MicroLayoutProps = {
  maxWidth?: number;
  minWidth?: number;
  children: React.ReactNode[];
};

function MicroLayout({
  children,
  maxWidth = MAX_LAYOUT_WIDTH,
  minWidth = MIN_LAYOUT_WIDTH,
}: MicroLayoutProps) {
  return (
    <div className="flex p-11 h-full ipad11Inch:h-[95%] ipadPro:h-[95%] justify-center items-start">
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
