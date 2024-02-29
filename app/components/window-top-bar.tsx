import { PropsWithChildren } from 'react';

type WindowTopBarProps = {
  height?: number;
};

function WindowTopBar(props: PropsWithChildren<WindowTopBarProps>) {
  const { height = 40, children } = props;
  return <div style={{ height }}>{children}</div>;
}

export { WindowTopBar };
