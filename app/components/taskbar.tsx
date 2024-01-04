import { PropsWithChildren } from 'react';

function TaskBar(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        height: '39px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        boxShadow: '0px 3px 6px #00000029',
        backdropFilter: 'blur(10px)',
        paddingLeft: 20,
        color: '#FFF',
      }}>
      {children}
    </div>
  );
}

export default TaskBar;
