import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { ListItem, SelectList } from '@/app/components/selectList';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import useOutsideClick from '@/app/hooks/use-outside-click';
import { useAppDispatch } from '@/lib/redux';
import {
  LayoutMode,
  setChatLayoutMode,
} from '@/lib/redux/slices/chatLayoutModeSlice';
import { SlashCommand } from './slash-commands';
import { Window } from '@components/window';

enum TextInputMode {
  NORMAL_TEXT,
  FILTER_LIST,
  AUTO_COMPLETE,
}

enum Size {
  SMALL,
  LARGE,
}

function PromptBox(props: {
  windowId: string;
  name: string;
  initialXY: [number, number];
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  promptTemplates: PromptTemplate[];
  activePromptTemplate?: PromptTemplate;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
  draggable?: boolean;
  onCloseClick?: () => void;
  onSelectPromptTemplate: (item: PromptTemplate | undefined) => void;
  onSendClick: (message: string) => void;
}) {
  const {
    windowId,
    promptTemplates,
    initialXY,
    draggable,
    onCloseClick,
    activePromptTemplate,
    onWindowChange,
    onSelectPromptTemplate,
    onSendClick,
    styles,
  } = props;
  const [size, setSize] = useState<Size>(Size.SMALL);
  const [promptMessage, setPromptMessage] = useState('');
  const [showPromptTemplateList, setShowPromptTemplateList] = useState(false);
  const [hoveredPromptTemplate, setHoveredPromptTemplate] =
    useState<PromptTemplate>();
  const [hoveredSelectedPromptTemplate, setSelectedHoveredPromptTemplate] =
    useState<PromptTemplate>();
  const [textInputMode, setTextInputMode] = useState<TextInputMode>(
    TextInputMode.NORMAL_TEXT
  );
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<
    ListItem[]
  >([]);
  const dispatch = useAppDispatch();

  useOutsideClick(
    [
      'prompt-template-list',
      'box-prompt-text-input',
      'prompt-template-trigger',
    ],
    () => {
      setShowPromptTemplateList(false);
      if (textInputMode === TextInputMode.FILTER_LIST) {
        clearPromptMessage();
        return;
      }

      if (textInputMode === TextInputMode.AUTO_COMPLETE) {
        clearCommandSuggestions();
        clearPromptMessage();
        return;
      }
    }
  );

  function clearPromptMessage() {
    setPromptMessage('');
  }

  function clearCommandSuggestions() {
    setAutoCompleteSuggestions([]);
  }

  function handleTextChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const inputValue = e.target.value;
    setPromptMessage(inputValue);

    // if (inputValue.startsWith('/')) {
    //   const commandFragment = inputValue.slice(1); // Remove the slash
    //   const suggestions: ListItem[] = Object.values(SlashCommand)
    //     .filter((cmd) => cmd.startsWith(commandFragment))
    //     .map((cmd) => ({
    //       id: cmd,
    //       displayName: cmd,
    //     }));
    //   setAutoCompleteSuggestions(suggestions);
    //   setTextInputMode(TextInputMode.AUTO_COMPLETE);
    // } else {
    //   clearCommandSuggestions();
    //   setTextInputMode(TextInputMode.NORMAL_TEXT);
    // }
  }

  // function handleSelectSuggestion(suggestion: string) {
  //   setPromptMessage('/' + suggestion);
  //   setAutoCompleteSuggestions([]);
  //   setTextInputMode(TextInputMode.NORMAL_TEXT);
  // }

  function handleOnSendMessageClick() {
    onSendClick(promptMessage);
    clearPromptMessage();
  }

  function handleSlashCommand(cmd: SlashCommand) {
    switch (cmd) {
      case SlashCommand.PROMPT_TEMPLATE:
        setShowPromptTemplateList(true);
        break;
      case SlashCommand.CLEAR_PROMPT_TEMPLATE:
        removeActivePromptTemplate();
        break;
      case SlashCommand.CHAT_LAYOUT_MODE_FREE:
        dispatch(setChatLayoutMode(LayoutMode.FREE));
        break;
      case SlashCommand.CHAT_LAYOUT_MODE_SLIDE:
        dispatch(setChatLayoutMode(LayoutMode.SLIDE));
        break;
      default:
        console.log('Unknown command', cmd);
        break;
    }
    clearPromptMessage();
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (promptMessage[0] === '/') {
        handleSlashCommand(promptMessage.substring(1) as SlashCommand);
        return;
      }

      if (textInputMode === TextInputMode.NORMAL_TEXT) {
        handleOnSendMessageClick();
        return;
      }

      if (textInputMode === TextInputMode.FILTER_LIST) {
        return;
      }
    }

    if (e.key === 'Escape') {
      if (textInputMode === TextInputMode.FILTER_LIST) {
        setShowPromptTemplateList(false);
        return;
      }

      if (textInputMode === TextInputMode.AUTO_COMPLETE) {
        clearCommandSuggestions();
        clearPromptMessage();
        return;
      }
    }
  }

  function handleTogglePromptTemplateList() {
    setShowPromptTemplateList((prev) => !prev);
  }

  function handlePromptTemplateClick(item: ListItem) {
    const selected = promptTemplates.find((pt) => pt.name === item.id);
    if (selected) {
      onSelectPromptTemplate(selected);
    }
    setShowPromptTemplateList(false);
    clearPromptMessage();
  }

  function handlePromptTemplateMouseOver(item: ListItem) {
    const promptTemplate = promptTemplates.find((pt) => pt.name === item.id);
    if (promptTemplate) {
      setHoveredPromptTemplate(promptTemplate);
    }
  }

  function handleSelectedPromptTemplateMouseOver(templateName: string) {
    return () => {
      const promptTemplate = promptTemplates.find(
        (pt) => pt.name === templateName
      );
      if (promptTemplate) {
        setSelectedHoveredPromptTemplate(promptTemplate);
      }
    };
  }

  function handleSelectedPromptTemplateMouseout() {
    setSelectedHoveredPromptTemplate(undefined);
  }

  function handlePromptTemplateMouseOut() {
    setHoveredPromptTemplate(undefined);
  }

  function removeActivePromptTemplate() {
    onSelectPromptTemplate(undefined);
  }

  function handleRemoveActivePromptTemplate(e: React.MouseEvent) {
    e.stopPropagation();
    removeActivePromptTemplate();
  }
  function handleResizeClick() {
    setSize((prevSize) => (prevSize === Size.LARGE ? Size.SMALL : Size.LARGE));
  }

  useEffect(() => {
    const list: ListItem[] = promptTemplates.map((pt) => ({
      id: pt.name,
      displayName: pt.name,
    }));
    setListItems(list);
  }, [promptTemplates]);

  useEffect(() => {
    if (showPromptTemplateList) {
      setTextInputMode(TextInputMode.FILTER_LIST);
    } else {
      setTextInputMode(TextInputMode.NORMAL_TEXT);
    }
  }, [showPromptTemplateList]);

  return (
    <Window
      id={windowId}
      initialXY={initialXY}
      initialWindowSize={[500, size === Size.LARGE ? 180 : 120]}
      resizeable={false}
      draggable={draggable}
      disableCloseIcon
      disableFadeIn
      name="Prompt"
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      styles={{ overflow: 'show', position: 'absolute', ...styles }}
      contentAreaStyles={{
        background: 'none',
        padding: 0,
        overflowY: 'visible',
        overflowX: 'visible',
      }}>
      <div className="absolute top-2 right-2">
        <Icon
          name={size === Size.LARGE ? IconName.Minimize : IconName.Maximize}
          size={14}
          lightModeColor="white"
          onClick={handleResizeClick}
        />
      </div>
      <div className="relative flex flex-col">
        <div className="flex gap-2">
          <div className="flex-1">
            {size === Size.LARGE ? (
              <TextArea
                id="box-prompt-text-input"
                name="sessionName"
                placeholder={
                  textInputMode === TextInputMode.FILTER_LIST
                    ? 'Search Prompt Templates'
                    : 'Message'
                }
                onChange={handleTextChange}
                value={promptMessage}
                onKeyDown={handleKeyDown}
                containerStyles={{
                  marginBottom: 0,
                }}
              />
            ) : (
              <TextInput
                id="box-prompt-text-input"
                name="sessionName"
                placeholder={
                  textInputMode === TextInputMode.FILTER_LIST
                    ? 'Search Prompt Templates'
                    : 'Message'
                }
                onChange={handleTextChange}
                value={promptMessage}
                onKeyDown={handleKeyDown}
              />
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full justify-between">
          <div
            className="flex items-center cursor-pointer"
            id="prompt-template-trigger"
            onClick={handleTogglePromptTemplateList}>
            <Image
              src="icons/prompt_template.svg"
              alt="close"
              width={24}
              height={24}
              style={{
                cursor: 'pointer',
                marginRight: 3,
              }}
            />
            <div className="flex items-center text-xs">
              Prompt Template
              {activePromptTemplate && (
                <div className="flex items-center">
                  <div className="text-white ml-1">--</div>
                  <div className="text-white ml-1">
                    <div className="text-blue-400 text-sm flex items-center">
                      <div
                        className="mr-1 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                        onMouseOver={handleSelectedPromptTemplateMouseOver(
                          activePromptTemplate.name
                        )}
                        onMouseOut={handleSelectedPromptTemplateMouseout}>
                        {activePromptTemplate.name}
                      </div>
                      <Icon
                        name={IconName.Close}
                        size={14}
                        lightModeColor="white"
                        onClick={handleRemoveActivePromptTemplate}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            className="btn-primary w-20"
            type="button"
            onClick={handleOnSendMessageClick}>
            Send
          </button>
        </div>
        {hoveredSelectedPromptTemplate && !showPromptTemplateList ? (
          <div className="absolute left-[520px] flex flex-col w-[500px]">
            <div className="bg-white/80 p-2 rounded-md shadow-md flex flex-col gap-0">
              <div className="text-sm font-bold text-gray-800">
                {hoveredSelectedPromptTemplate.name}
              </div>
              <div className="text-xs text-gray-700">
                {hoveredSelectedPromptTemplate.description}
              </div>
              <div className="text-xs text-gray-800 pt-3">Template:</div>
              <div className="text-xs text-gray-700">
                {hoveredSelectedPromptTemplate.template}
              </div>
            </div>
          </div>
        ) : null}
        {showPromptTemplateList && (
          <div className="absolute flex top-[-60px] left-[350px] gap-2">
            <SelectList
              id="prompt-template-list"
              data={listItems}
              styles={{ width: 300 }}
              highlight={
                textInputMode === TextInputMode.FILTER_LIST
                  ? promptMessage
                  : undefined
              }
              onItemClick={handlePromptTemplateClick}
              onItemMouseOver={handlePromptTemplateMouseOver}
              onItemMouseOut={handlePromptTemplateMouseOut}
            />
            {hoveredPromptTemplate && (
              <div className="flex flex-col w-[500px]">
                <div className="bg-white/80 p-2 rounded-md shadow-md flex flex-col gap-0">
                  <div className="text-sm font-bold text-gray-800">
                    {hoveredPromptTemplate.name}
                  </div>
                  <div className="text-xs text-gray-700">
                    {hoveredPromptTemplate.description}
                  </div>
                  <div className="text-xs text-gray-800 pt-3">Template:</div>
                  <div className="text-xs text-gray-700">
                    {hoveredPromptTemplate.template}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {autoCompleteSuggestions.length > 0 && (
          <SelectList
            id="autocomplete-command-list"
            data={autoCompleteSuggestions}
            styles={{
              position: 'absolute',
              top: -10,
              left: -320,
              width: 300,
            }}
            onItemClick={() => null}
          />
        )}
      </div>
    </Window>
  );
}

export { PromptBox };
