import React, { ReactElement } from 'react';
import {
  FolderIcon,
  FolderForChatSessionsIcon,
  IconName,
  ChatBubblesIcon,
  RunCookbookIcon,
} from './IconSVG';

type DesktopIconProps = {
  name: IconName;
  label: string;
  size?: number;
  gap?: number;
  onClick?: () => void;
};

function DesktopIcon(props: DesktopIconProps) {
  const { name, label, size = 50, gap = 5, onClick } = props;
  let iconToRender: ReactElement | null = null;
  switch (name) {
    case IconName.Folder:
      iconToRender = (
        <FolderIcon
          backColor="#2980b9"
          frontColor="#3498db"
          midColor="#bdc3c7"
          width={size}
          height={size}
        />
      );
      break;
    case IconName.FolderForChatSessions:
      iconToRender = (
        <FolderForChatSessionsIcon
          backColor="#2980b9"
          frontColor="#3498db"
          midColor="#bdc3c7"
          chatIconColor="#2980b9"
          width={size}
          height={size}
        />
      );
      break;
    case IconName.ChatBubbles:
      iconToRender = <ChatBubblesIcon outlineColor="#FFFFFF" width={size} height={size} />;
      break;
    case IconName.RunCookbook:
      iconToRender = <RunCookbookIcon outlineColor="#FFFFFF" width={40} height={40} />;
      break;
    default:
      iconToRender = null;
  }
  return (
    <div className="flex flex-col justify-center items-center dark:text-white" onClick={onClick}>
      <div className="cursor-pointer hover:opacity-60" style={{ paddingBottom: gap }}>
        {iconToRender}
      </div>
      <div className="text-xs dark:text-white">{label}</div>
    </div>
  );
}

export { DesktopIcon };
