import { PropsWithChildren } from 'react';

type WindowInfoPanelProps = {
  title: string;
  description?: string;
};

function WindowInfoPanel(props: PropsWithChildren<WindowInfoPanelProps>) {
  const { title, description, children } = props;
  return (
    <div className="h-full p-4 text-gray-600">
      <div className="flex flex-col">
        <h3 className="text-md font-bold">{title}</h3>
        <p className="mb-3 text-sm">{description}</p>
        {children}
      </div>
    </div>
  );
}

export { WindowInfoPanel };
