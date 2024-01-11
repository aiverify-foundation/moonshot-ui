import { PropsWithChildren } from 'react';

type WindowInfoPanelProps = {
  styles?: React.CSSProperties;
};

function WindowInfoPanel(props: PropsWithChildren<WindowInfoPanelProps>) {
  const { styles, children } = props;
  return (
    <div
      style={{
        borderLeft: '1px solid #dbdada',
        color: '#494848',
        paddingTop: 15,
        paddingLeft: 15,
        ...styles,
      }}>
      {children}
    </div>
  );
}

export { WindowInfoPanel };
