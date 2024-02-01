import React, { ReactElement } from 'react';
import { FolderIcon, FolderForChatSessionsIcon, IconName } from './IconSVG';

type DesktopIconProps = {
  name: IconName;
  label: string;
  onClick?: () => void;
};

function DesktopIcon(props: DesktopIconProps) {
  const { name, label, onClick } = props;
  let iconToRender: ReactElement | null = null;
  switch (name) {
    case IconName.Folder:
      iconToRender = <FolderIcon backColor="#2980b9" frontColor="#3498db" midColor="#bdc3c7" />;
      break;
    case IconName.FolderForChatSessions:
      iconToRender = (
        <FolderForChatSessionsIcon
          backColor="#2980b9"
          frontColor="#3498db"
          midColor="#bdc3c7"
          chatIconColor="#2980b9"
        />
      );
      break;
    default:
      iconToRender = null;
  }
  return (
    <div className="flex flex-col justify-center items-center dark:text-white" onClick={onClick}>
      <div className="cursor-pointer">{iconToRender}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}

export { DesktopIcon };
