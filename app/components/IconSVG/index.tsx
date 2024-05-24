import { ReactElement } from 'react';

import { AlertIcon } from './icons/alert-icon';
import { ArrowLeftIcon } from './icons/arrow-left-icon';
import { WideArrowLeftIcon } from './icons/arrow-left-wide-icon';
import { ArrowRightIcon } from './icons/arrow-right-icon';
import { WideArrowRightIcon } from './icons/arrow-right-wide-icon';
import { AsteriskIcon } from './icons/asterisk-icon';
import { BellIcon } from './icons/bell-icon';
import { BookIcon } from './icons/book-icon';
import { SolidBoxIcon } from './icons/box-icon';
import { OutlineBoxIcon } from './icons/box-outline-icon';
import { BurgerMenuIcon } from './icons/burger-menu-icon';
import { ChatBubbleWideIcon } from './icons/chat-bubble-wide-icon';
import { ChatBubblesIcon } from './icons/chat-bubbles-icon';
import { CheckedSquareIcon } from './icons/checked-square-icon';
import { CheckListIcon } from './icons/checklist-icon';
import { CircleArrowLeftIcon } from './icons/circle-arrow-left-icon';
import { CircleArrowRightIcon } from './icons/circle-arrow-right-icon';
import { CloseIcon } from './icons/close-x-icon';
import { DarkMoonIcon } from './icons/dark-moon-icon';
import { DocumentIcon } from './icons/document-icon';
import { FileIcon } from './icons/file-icon';
import { FolderForChatSessionsIcon } from './icons/folder-chat-icon';
import { FolderIcon } from './icons/folder-icon';
import { HistoryClockIcon } from './icons/history-clock-icon';
import { LayoutColumnsIcon } from './icons/layout-columns-icon';
import { LayoutWtfIcon } from './icons/layout-wtf-icon';
import { LightBulb } from './icons/light-bulb-icon';
import { LightSunIcon } from './icons/light-sun-icon';
import { LightningIcon } from './icons/lightning-icon';
import { ListIcon } from './icons/list-icon';
import { MaximizeIcon } from './icons/maximize-icon';
import { MinimizeIcon } from './icons/minimize-icon';
import { MoonshotAttackStrategyIcon } from './icons/ms-attack-icon';
import { MoonshotContextStrategyIcon } from './icons/ms-context-strategy-icon';
import { MoonshotPromptTemplateIcon } from './icons/ms-prompt-template-icon';
import { PencilIcon } from './icons/pencil-icon';
import { PlusIcon } from './icons/plus-icon';
import { ResetIcon } from './icons/reset-icon';
import { RibbonIcon } from './icons/ribbon-icon';
import { RunCookbookIcon } from './icons/run-cookbook-icon';
import { SpacesuitIcon } from './icons/spacesuit-icon';
import { SquareIcon } from './icons/square-icon';
import { TableIcon } from './icons/table-icon';
import { TalkBubblesIcon } from './icons/talkbubbles-icon';
import { ToolsIcon } from './icons/tools-icon';
import { WarningIcon } from './icons/warning-icon';
import { WideArrowDownIcon } from './icons/wide-arrow-down';
import { WideArrowUpIcon } from './icons/wide-arrow-up';

enum IconName {
  Folder,
  FolderForChatSessions,
  ChatBubbles,
  ChatBubbleWide,
  RunCookbook,
  BurgerMenu,
  DarkMoon,
  LightSun,
  Close,
  CircleArrowRight,
  CircleArrowLeft,
  ArrowLeft,
  ArrowRight,
  WideArrowDown,
  WideArrowUp,
  Maximize,
  Minimize,
  LayoutWtf,
  LayoutColumns,
  Reset,
  SolidBox,
  OutlineBox,
  Plus,
  Square,
  CheckedSquare,
  List,
  File,
  Book,
  Table,
  Bell,
  Asterisk,
  CheckList,
  Spacesuit,
  HistoryClock,
  Tools,
  Lightning,
  LightBulb,
  Ribbon,
  TalkBubbles,
  Document,
  Warning,
  Pencil,
  MoonContextStrategy,
  MoonPromptTemplate,
  MoonAttackStrategy,
  Alert,
  WideArrowLeft,
  WideArrowRight,
}

type IconProps = {
  name: IconName;
  size?: number;
  disabled?: boolean;
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
};

function Icon(props: IconProps) {
  const {
    name,
    color = '#FFFFFF',
    onClick,
    onMouseDown,
    disabled = false,
    size = 20,
    style,
  } = props;

  let iconToRender: ReactElement | null = null;

  switch (name) {
    case IconName.Alert:
      iconToRender = (
        <AlertIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
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
      iconToRender = (
        <ChatBubblesIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.RunCookbook:
      iconToRender = (
        <RunCookbookIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.BurgerMenu:
      iconToRender = (
        <BurgerMenuIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.DarkMoon:
      iconToRender = (
        <DarkMoonIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.LightSun:
      iconToRender = (
        <LightSunIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Close:
      iconToRender = (
        <CloseIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.WideArrowLeft:
      iconToRender = (
        <WideArrowLeftIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.WideArrowRight:
      iconToRender = (
        <WideArrowRightIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.CircleArrowRight:
      iconToRender = (
        <CircleArrowRightIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.CircleArrowLeft:
      iconToRender = (
        <CircleArrowLeftIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Maximize:
      iconToRender = (
        <MaximizeIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Minimize:
      iconToRender = (
        <MinimizeIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.LayoutWtf:
      iconToRender = (
        <LayoutWtfIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.LayoutColumns:
      iconToRender = (
        <LayoutColumnsIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.ChatBubbleWide:
      iconToRender = (
        <ChatBubbleWideIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Reset:
      iconToRender = (
        <ResetIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.SolidBox:
      iconToRender = (
        <SolidBoxIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.OutlineBox:
      iconToRender = (
        <OutlineBoxIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Plus:
      iconToRender = (
        <PlusIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Square:
      iconToRender = (
        <SquareIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.CheckedSquare:
      iconToRender = (
        <CheckedSquareIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.List:
      iconToRender = (
        <ListIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.File:
      iconToRender = (
        <FileIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Book:
      iconToRender = (
        <BookIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.ArrowLeft:
      iconToRender = (
        <ArrowLeftIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.ArrowRight:
      iconToRender = (
        <ArrowRightIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Table:
      iconToRender = (
        <TableIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Bell:
      iconToRender = (
        <BellIcon
          outlineColor={color}
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Asterisk:
      iconToRender = (
        <AsteriskIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.CheckList:
      iconToRender = (
        <CheckListIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Spacesuit:
      iconToRender = (
        <SpacesuitIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.HistoryClock:
      iconToRender = (
        <HistoryClockIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Tools:
      iconToRender = (
        <ToolsIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Lightning:
      iconToRender = (
        <LightningIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.WideArrowDown:
      iconToRender = (
        <WideArrowDownIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.WideArrowUp:
      iconToRender = (
        <WideArrowUpIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.LightBulb:
      iconToRender = (
        <LightBulb
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Ribbon:
      iconToRender = (
        <RibbonIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.TalkBubbles:
      iconToRender = (
        <TalkBubblesIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Document:
      iconToRender = (
        <DocumentIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Warning:
      iconToRender = (
        <WarningIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.Pencil:
      iconToRender = (
        <PencilIcon
          outlineColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.MoonContextStrategy:
      iconToRender = (
        <MoonshotContextStrategyIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.MoonPromptTemplate:
      iconToRender = (
        <MoonshotPromptTemplateIcon
          fillColor={color}
          width={size}
          height={size}
        />
      );
      break;
    case IconName.MoonAttackStrategy:
      iconToRender = (
        <MoonshotAttackStrategyIcon
          outlineColor={color}
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
        ${onClick ? 'cursor-pointer' : 'default'}
        ${onClick ? 'hover:opacity-50 active:opacity-25' : ''}
        ${disabled ? 'opacity-20 pointer-events-none' : ''}
      `}
      style={style}
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
