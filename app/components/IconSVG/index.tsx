import { ReactElement } from 'react';

import { useAppSelector } from '@/lib/redux';
import { BurgerMenuIcon } from './icons/burger-menu-icon';
import { ChatBubblesIcon } from './icons/chat-bubbles-icon';
import { DarkMoonIcon } from './icons/dark-moon-icon';
import { FolderForChatSessionsIcon } from './icons/folder-chat-icon';
import { FolderIcon } from './icons/folder-icon';
import { LightSunIcon } from './icons/light-sun-icon';
import { RunCookbookIcon } from './icons/run-cookbook-icon';

enum IconName {
  Folder,
  FolderForChatSessions,
  ChatBubbles,
  RunCookbook,
  BurgerMenu,
  DarkMoon,
  LightSun,
}

type IconProps = {
  name: IconName;
  size?: number;
  onClick?: () => void;
};

function Icon(props: IconProps) {
  const { name, onClick, size = 20 } = props;

  let iconToRender: ReactElement | null = null;
  const isDarkMode = useAppSelector((state) => state.darkMode.value);

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
          width={size}
          height={size}
        />
      );
      break;
    case IconName.BurgerMenu:
      iconToRender = (
        <BurgerMenuIcon
          outlineColor={isDarkMode ? '#FFFFFF' : '#a21caf'}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.DarkMoon:
      iconToRender = (
        <DarkMoonIcon
          outlineColor={isDarkMode ? '#FFFFFF' : '#a21caf'}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.LightSun:
      iconToRender = (
        <LightSunIcon
          outlineColor={isDarkMode ? '#FFFFFF' : '#a21caf'}
          width={size}
          height={size}
        />
      );
      break;
    default:
      iconToRender = null;
  }

  return (
    <div
      className={`
        flex items-center justify-center 
        cursor-pointer
        ${onClick ? 'hover:opacity-50' : ''}
      `}
      onClick={onClick}>
      {iconToRender}
    </div>
  );
}

export {
  Icon,
  IconName,
  BurgerMenuIcon,
  FolderIcon,
  FolderForChatSessionsIcon,
  ChatBubblesIcon,
  RunCookbookIcon,
};
