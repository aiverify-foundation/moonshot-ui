import React, { useEffect, useState } from 'react';
import { Button, ButtonType } from '@/app/components/button';
import { ListItem, SelectList } from '@/app/components/selectList';
import { TextArea } from '@/app/components/textArea';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { Window } from '@/app/components/window';
import { colors } from '@/app/customColors';
import useOutsideClick from '@/app/hooks/use-outside-click';
import { debounce } from '@/app/lib/throttle';
import { ColorCodedTemplateString } from './color-coded-template';

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
  width?: number;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  promptTemplates: PromptTemplate[];
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
};

function PromptBox(props: PromptBoxProps) {
  const {
    windowId,
    zIndex,
    promptTemplates,
    initialXY,
    width = 500,
    draggable,
    disabled,
    onCloseClick,
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
  const [showSlashCommands, setShowSlashCommands] = useState(false);

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
  }

  function handleOnSendMessageClick() {
    onSendClick(promptMessage);
    clearPromptMessage();
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
      initialWindowSize={[width, 190]}
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
      </div>
    </Window>
  );
}

export { PromptBox };
