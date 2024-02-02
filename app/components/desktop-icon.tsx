import React, { ReactElement } from 'react';
import { useAppSelector } from '@/lib/redux';
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
  const isDarkMode = useAppSelector((state) => state.darkMode.value);
  let iconToRender: ReactElement | null = null;
  switch (name) {
    case IconName.Folder:
      iconToRender = (
        <FolderIcon
          backColor={isDarkMode ? '#2980b9' : '#701a75'}
          frontColor={isDarkMode ? '#3498db' : '#86198f'}
          midColor="#bdc3c7"
          width={size}
          height={size}
        />
      );
      break;
    case IconName.FolderForChatSessions:
      iconToRender = (
        <FolderForChatSessionsIcon
          backColor={isDarkMode ? '#2980b9' : '#701a75'}
          frontColor={isDarkMode ? '#3498db' : '#86198f'}
          midColor="#bdc3c7"
          chatIconColor={isDarkMode ? '#2980b9' : '#f5d0fe'}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.ChatBubbles:
      iconToRender = (
        <ChatBubblesIcon
          outlineColor={isDarkMode ? '#FFFFFF' : '#a21caf'}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.RunCookbook:
      iconToRender = (
        <RunCookbookIcon
          outlineColor={isDarkMode ? '#FFFFFF' : '#a21caf'}
          width={40}
          height={40}
        />
      );
      break;
    default:
      iconToRender = null;
  }
  return (
    <div
      className="flex flex-col justify-center items-center dark:text-white"
      onClick={onClick}>
      <div
        className="cursor-pointer hover:opacity-60"
        style={{ paddingBottom: gap }}>
        {iconToRender}
      </div>
      <div className="text-xs dark:text-white text-purple-950 font-medium">
        {label}
      </div>
    </div>
  );
}

export { DesktopIcon };
