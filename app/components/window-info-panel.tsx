import { PropsWithChildren } from 'react';

type WindowInfoPanelProps = {
  styles?: React.CSSProperties;
};

function WindowInfoPanel(
  props: PropsWithChildren<WindowInfoPanelProps>
) {
  const { children } = props;
  return <div className="p-4 h-full text-gray-600">{children}</div>;
}

export { WindowInfoPanel };
