import { PropsWithChildren } from 'react';

type TaskBarProps = {
  zIndex: number;
};

function TaskBar(props: PropsWithChildren<TaskBarProps>) {
  const { zIndex, children } = props;
  return (
    <div
      className="
      fixed h-10 pl-2 w-full
      dark:bg-neutral-900/70
      dark:shadow-neutral-900 
      dark:text-white 
      bg-white
      shadow-neutral-900/20
      border-b
      dark:border-none
      border-fuchsia-900
      shadow-sm"
      style={{ zIndex }}>
      {children}
    </div>
  );
}

export default TaskBar;
