import { ReactElement } from 'react';

import { useAppSelector } from '@/lib/redux';
import { CircleArrowLeftIcon } from './icons/arrow-left-icon';
import { CircleArrowRightIcon } from './icons/arrow-right-icon';
import { BurgerMenuIcon } from './icons/burger-menu-icon';
import { ChatBubblesIcon } from './icons/chat-bubbles-icon';
import { CloseIcon } from './icons/close-x-icon';
import { DarkMoonIcon } from './icons/dark-moon-icon';
import { FolderForChatSessionsIcon } from './icons/folder-chat-icon';
import { FolderIcon } from './icons/folder-icon';
import { LightSunIcon } from './icons/light-sun-icon';
import { RunCookbookIcon } from './icons/run-cookbook-icon';
import { MaximizeIcon } from './icons/maximize-icon';
import { MinimizeIcon } from './icons/minimize-icon';

enum IconName {
  Folder,
  FolderForChatSessions,
  ChatBubbles,
  RunCookbook,
  BurgerMenu,
  DarkMoon,
  LightSun,
  Close,
  CircleArrowRight,
  CircleArrowLeft,
  Maximize,
  Minimize
}

type IconProps = {
  name: IconName;
  size?: number;
  lightModeColor?: string;
  darkModeColor?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
};

function Icon(props: IconProps) {
  const {
    name,
    onClick,
    onMouseDown,
    disabled = false,
    size = 20,
    lightModeColor,
    darkModeColor,
  } = props;

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
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.RunCookbook:
      iconToRender = (
        <RunCookbookIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.BurgerMenu:
      iconToRender = (
        <BurgerMenuIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.DarkMoon:
      iconToRender = (
        <DarkMoonIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.LightSun:
      iconToRender = (
        <LightSunIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Close:
      iconToRender = (
        <CloseIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.CircleArrowRight:
      iconToRender = (
        <CircleArrowRightIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.CircleArrowLeft:
      iconToRender = (
        <CircleArrowLeftIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Maximize:
      iconToRender = (
        <MaximizeIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Minimize:
      iconToRender = (
        <MinimizeIcon
          outlineColor={
            isDarkMode
              ? darkModeColor || '#FFFFFF'
              : lightModeColor || '#a21caf'
          }
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
        ${onClick ? 'hover:opacity-50 active:opacity-25' : ''}
        ${disabled ? 'opacity-20 pointer-events-none' : ''}
      `}
      onClick={disabled ? undefined : onClick}
      onMouseDown={disabled ? undefined : onMouseDown}>
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
  CloseIcon,
};
