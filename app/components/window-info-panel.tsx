import { PropsWithChildren } from "react";

function WindowInfoPanel(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div style={{ borderLeft: '1px solid #dbdada', color: '#494848', padding: 15 }}>{children}</div>
  )
}

export { WindowInfoPanel }