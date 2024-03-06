import { PropsWithChildren } from 'react';

type WindowTopBarProps = {
  height?: number;
};

function WindowTopBarButtonGroup(props: PropsWithChildren<WindowTopBarProps>) {
  const { height = 40, children } = props;
  return (
    <div
      style={{ height }}
      className="shrink-0 bg-fuchsia-950/60 rounded px-1">
      {children}
    </div>
  );
}

export { WindowTopBarButtonGroup };
