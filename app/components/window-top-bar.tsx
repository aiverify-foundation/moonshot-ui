import { PropsWithChildren } from 'react';

type WindowTopBarProps = {
  height?: number;
};

function WindowTopBar(props: PropsWithChildren<WindowTopBarProps>) {
  const { height = 40, children } = props;
  return (
    <div
      style={{ height }}
      className="shrink-0">
      {children}
    </div>
  );
}

export { WindowTopBar };
