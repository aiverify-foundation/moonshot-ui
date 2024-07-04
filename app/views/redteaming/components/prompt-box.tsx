import React, { useEffect, useState } from 'react';
import { Button, ButtonType } from '@/app/components/button';
import { ListItem, SelectList } from '@/app/components/selectList';
import { TextArea } from '@/app/components/textArea';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import useOutsideClick from '@/app/hooks/use-outside-click';
import { debounce } from '@/app/lib/throttle';
import useChatboxesPositionsUtils from '@/app/views/redteaming/hooks/useChatboxesPositionsUtils';
import { colors } from '@/app/views/shared-components/customColors';
import { toggleDarkMode, useAppDispatch } from '@/lib/redux';
import {
  LayoutMode,
  setChatLayoutMode,
} from '@/lib/redux/slices/chatLayoutModeSlice';
import { ColorCodedTemplateString } from './color-coded-template';
import { SlashCommand, descriptionByCommand } from './slash-commands';
import { Window } from '@components/window';

enum TextInputMode {
  PROMPT_TEXT,
  PROMPT_TEMPLATE,
  SLASH_COMMAND,
}

type PromptBoxProps = {
  windowId: string;
  zIndex: number;
  name: string;
  initialXY?: [number, number];
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  promptTemplates: PromptTemplate[];
  activePromptTemplate?: PromptTemplate;
  chatSession: SessionData;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
  draggable?: boolean;
  disabled?: boolean;
  onCloseClick?: () => void;
  onSelectPromptTemplate: (item: PromptTemplate) => Promise<void>;
  onSendClick: (message: string) => void;
  onCloseSessionCommand?: () => void;
};

const ENABLE_FEATURE_COMMAND_LINE = false;

function PromptBox(props: PromptBoxProps) {
  const {
    windowId,
    zIndex,
    promptTemplates,
    initialXY,
    draggable,
    disabled,
    onCloseClick,
    activePromptTemplate,
    chatSession,
    onWindowChange,
    onSelectPromptTemplate,
    onSendClick,
    styles,
  } = props;
  const [promptMessage, setPromptMessage] = useState('');
  const [showPromptTemplateList, setShowPromptTemplateList] = useState(false);
  const [hoveredPromptTemplate, setHoveredPromptTemplate] =
    useState<PromptTemplate>();
  const [hoveredSelectedPromptTemplate, _] = useState<PromptTemplate>();
  const [textInputMode, setTextInputMode] = useState<TextInputMode>(
    TextInputMode.PROMPT_TEXT
  );
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [commandString, setCommandString] = useState<string | undefined>();
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const { resetChatboxPositions } = useChatboxesPositionsUtils(chatSession);
  const dispatch = useAppDispatch();

  const slashCommandList = Object.values(SlashCommand).map((cmd) => ({
    id: cmd,
    displayName: `${cmd} - ${descriptionByCommand[cmd]}`,
  }));

  useOutsideClick(
    [
      'prompt-template-list',
      'box-prompt-text-input',
      'prompt-template-trigger',
    ],
    () => {
      setShowPromptTemplateList(false);
      setShowSlashCommands(false);
      clearPromptMessage();
    }
  );

  useOutsideClick(['command-list'], () => {
    setShowSlashCommands(false);
    clearPromptMessage();
  });

  function clearPromptMessage() {
    setPromptMessage('');
  }

  function handleTextChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const inputValue = e.target.value;
    setPromptMessage(inputValue);

    if (ENABLE_FEATURE_COMMAND_LINE && inputValue.startsWith('/')) {
      const commandFragment = inputValue.slice(1); // Remove the slash
      setShowPromptTemplateList(false);
      setCommandString(commandFragment);
      setShowSlashCommands(true);
      setTextInputMode(TextInputMode.SLASH_COMMAND);
    } else {
      setCommandString(undefined);
      setShowSlashCommands(false);
      if (!showPromptTemplateList) {
        setTextInputMode(TextInputMode.PROMPT_TEXT);
      }
    }
  }

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
        removeActivePromptTemplate(activePromptTemplate);
        break;
      case SlashCommand.CHAT_LAYOUT_MODE_FREE:
        dispatch(setChatLayoutMode(LayoutMode.FREE));
        break;
      case SlashCommand.CHAT_LAYOUT_MODE_SLIDE:
        dispatch(setChatLayoutMode(LayoutMode.SLIDE));
        break;
      case SlashCommand.RESET_LAYOUT_MODE:
        resetChatboxPositions(true);
        break;
      case SlashCommand.DARK_MODE_ON:
        dispatch(toggleDarkMode());
        document.documentElement.classList.add('dark');
        break;
      case SlashCommand.DARK_MODE_OFF:
        dispatch(toggleDarkMode());
        document.documentElement.classList.remove('dark');
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

      if (textInputMode === TextInputMode.PROMPT_TEXT) {
        handleOnSendMessageClick();
        return;
      }

      if (textInputMode === TextInputMode.PROMPT_TEMPLATE) {
        return;
      }
    }

    if (e.key === 'Escape') {
      if (textInputMode === TextInputMode.PROMPT_TEMPLATE) {
        setShowPromptTemplateList(false);
        clearPromptMessage();
        return;
      }

      if (textInputMode === TextInputMode.SLASH_COMMAND) {
        setShowSlashCommands(false);
        clearPromptMessage();
        setCommandString(undefined);
        return;
      }
    }
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

  const handlePromptTemplateMatch = debounce((item: ListItem) => {
    const promptTemplate = promptTemplates.find((pt) => pt.name === item.id);
    if (promptTemplate) {
      setHoveredPromptTemplate(promptTemplate);
    }
  }, 100);

  function handlePromptTemplateUnMatch() {
    setHoveredPromptTemplate(undefined);
  }

  function handlePromptTemplateMouseOut() {
    setHoveredPromptTemplate(undefined);
  }

  function removeActivePromptTemplate(template: PromptTemplate | undefined) {
    if (!template) return;
    onSelectPromptTemplate(template);
  }

  function handleCommandListItemSelected(item: ListItem) {
    const selected = slashCommandList.find((cmd) => cmd.id === item.id);
    if (selected) {
      handleSlashCommand(selected.id as SlashCommand);
    }
    setShowSlashCommands(false);
    clearPromptMessage();
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
      setTextInputMode(TextInputMode.PROMPT_TEMPLATE);
    } else if (showSlashCommands) {
      setTextInputMode(TextInputMode.SLASH_COMMAND);
    } else {
      setTextInputMode(TextInputMode.PROMPT_TEXT);
    }
  }, [showPromptTemplateList, showSlashCommands]);

  return (
    <Window
      zIndex={zIndex}
      id={windowId}
      initialXY={initialXY}
      initialWindowSize={[500, 190]}
      resizeable={false}
      draggable={draggable}
      disableCloseIcon
      disableFadeIn
      header={
        <div className="flex items-center h-8 text-[1rem] tracking-wide text-moonpurplelight">
          Prompt
        </div>
      }
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      styles={{ overflow: 'show', ...styles }}
      contentAreaStyles={{
        background: 'none',
        padding: 0,
        overflowY: 'visible',
        overflowX: 'visible',
        marginRight: '1rem',
        marginLeft: '1rem',
      }}
      headerAreaStyles={{
        backgroundColor: 'transparent',
        marginBottom: 0,
      }}>
      {disabled && (
        <div
          className="absolute gap-2 bg-transparent w-full h-full z-10 flex justify-center items-center"
          style={{ top: 0, left: 0 }}>
          <div className="waitspinner" />
        </div>
      )}
      {ENABLE_FEATURE_COMMAND_LINE && (
        <div className="absolute top-2 right-8 text-xs text-white/90">
          (Enter &apos;/ &apos; for commands)
        </div>
      )}
      <div className="relative flex flex-col gap-1">
        <div className="flex gap-2">
          <div className="flex-1">
            {showPromptTemplateList ? (
              <Tooltip
                flash
                flashDuration={8000}
                content="Enter template name to search the prompt template list"
                position={TooltipPosition.left}
                offsetLeft={-20}>
                <div className="h-full w-0" />
              </Tooltip>
            ) : null}
            <TextArea
              id="box-prompt-text-input"
              name="sessionName"
              shouldFocus={showPromptTemplateList}
              placeholder={
                textInputMode === TextInputMode.PROMPT_TEMPLATE
                  ? 'Search Prompt Templates'
                  : 'Write a prompt...'
              }
              inputStyles={
                showPromptTemplateList
                  ? { backgroundColor: '#f5d0fe' }
                  : {
                      backgroundColor: colors.chatPrompTextArea,
                      border: 'none',
                      color: colors.white,
                      boxShadow: 'inset 0 0 5px 0 rgba(0, 0, 0, 0.4)',
                    }
              }
              onChange={handleTextChange}
              value={promptMessage}
              onKeyDown={handleKeyDown}
              containerStyles={{
                marginBottom: 0,
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 w-full justify-end">
          {/* {promptTemplateTrigger} */}
          <Button
            text="Send"
            width={80}
            size="md"
            mode={ButtonType.PRIMARY}
            disabled={promptMessage.trim().length === 0}
            type="button"
            onClick={handleOnSendMessageClick}
            hoverBtnColor={colors.moongray[950]}
            pressedBtnColor={colors.moongray[900]}
          />
        </div>
        {hoveredSelectedPromptTemplate && !showPromptTemplateList ? (
          <div className="absolute left-[500px] top-[-40px] flex flex-col w-[400px]">
            <div className="bg-white/90 p-2 rounded-md flex flex-col gap-0">
              <div className="text-sm font-bold text-gray-800 underline">
                {hoveredSelectedPromptTemplate.name}
              </div>
              <div className="text-xs text-gray-700">
                {hoveredSelectedPromptTemplate.description}
              </div>
              <div className="text-sm text-gray-800 pt-3 font-bold">
                Template:
              </div>
              <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto custom-scrollbar">
                <ColorCodedTemplateString
                  template={hoveredSelectedPromptTemplate.template}
                />
              </div>
            </div>
          </div>
        ) : null}
        {showPromptTemplateList && (
          <div className="absolute flex top-[-220px] gap-2">
            <SelectList
              id="prompt-template-list"
              data={listItems}
              styles={{
                width: 475,
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.4)',
              }}
              highlight={
                textInputMode === TextInputMode.PROMPT_TEMPLATE
                  ? promptMessage
                  : undefined
              }
              onHighlighted={handlePromptTemplateMatch}
              onUnHighlighted={handlePromptTemplateUnMatch}
              onItemClick={handlePromptTemplateClick}
              onItemMouseOver={handlePromptTemplateMouseOver}
              onItemMouseOut={handlePromptTemplateMouseOut}
            />
            {hoveredPromptTemplate && (
              <div className="flex flex-col w-[400px]">
                <div className="bg-white p-2 rounded-md shadow-md flex flex-col gap-0 border">
                  <div className="text-lg font-bold text-gray-800">
                    {hoveredPromptTemplate.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {hoveredPromptTemplate.description}
                  </div>
                  <div className="text-sm text-gray-800 pt-3 font-bold">
                    Template
                  </div>
                  <div className="text-sm text-gray-700 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <ColorCodedTemplateString
                      template={hoveredPromptTemplate.template}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {showSlashCommands && (
          <SelectList
            id="command-list"
            data={slashCommandList}
            styles={{
              position: 'absolute',
              top: -220,
              boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.4)',
              width: 475,
            }}
            highlight={
              textInputMode === TextInputMode.SLASH_COMMAND
                ? commandString
                : undefined
            }
            onItemClick={handleCommandListItemSelected}
          />
        )}
      </div>
    </Window>
  );
}

export { PromptBox };
