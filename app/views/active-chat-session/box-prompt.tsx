import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { ListItem, SelectList } from '@/app/components/selectList';
import { TextArea } from '@/app/components/textArea';
import useOutsideClick from '@/app/hooks/use-outside-click';
import { getWindowId } from '@/app/lib/window';
import { Window } from '@components/window';
import { SlashCommand } from './slash-commands';

enum TextInputMode {
  NORMAL_TEXT,
  FILTER_LIST,
  AUTO_COMPLETE,
}

function BoxPrompt(props: {
  name: string;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  promptTemplates: PromptTemplate[];
  activePromptTemplate?: PromptTemplate;
  onCloseClick?: () => void;
  onSelectPromptTemplate: (item: PromptTemplate | undefined) => void;
  onSendClick: (message: string) => void;
}) {
  const {
    promptTemplates,
    onCloseClick,
    activePromptTemplate,
    onSelectPromptTemplate,
    onSendClick,
    styles,
  } = props;
  const [promptMessage, setPromptMessage] = useState('');
  const [showPromptTemplateList, setShowPromptTemplateList] =
    useState(false);
  const [textInputMode, setTextInputMode] = useState<TextInputMode>(
    TextInputMode.NORMAL_TEXT
  );
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] =
    useState<ListItem[]>([]);
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
    e: React.ChangeEvent<HTMLTextAreaElement>
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
      default:
        console.log('Unknown command', cmd);
        break;
    }
    clearPromptMessage();
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (promptMessage[0] === '/') {
        handleSlashCommand(
          promptMessage.substring(1) as SlashCommand
        );
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
    const selected = promptTemplates.find(
      (pt) => pt.name === item.id
    );
    if (selected) {
      onSelectPromptTemplate(selected);
    }
    setShowPromptTemplateList(false);
    clearPromptMessage();
  }

  function removeActivePromptTemplate() {
    onSelectPromptTemplate(undefined);
  }

  function handleRemoveActivePromptTemplate(e: React.MouseEvent) {
    e.stopPropagation();
    removeActivePromptTemplate();
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
      id={getWindowId('box-prompt')}
      initialXY={[600, 600]}
      initialWindowSize={[500, 180]}
      resizeable={false}
      disableFadeIn
      name="Prompt"
      onCloseClick={onCloseClick}
      styles={{ overflow: 'show', position: 'absolute', ...styles }}
      contentAreaStyles={{
        background: 'none',
        padding: 0,
        overflowY: 'visible',
        overflowX: 'visible',
      }}>
      <div className="relative flex flex-col">
        <div className="flex gap-2">
          <div className="flex-1">
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
                      <div className="mr-1 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
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
        {showPromptTemplateList && (
          <SelectList
            id="prompt-template-list"
            data={listItems}
            styles={{
              position: 'absolute',
              top: -60,
              left: 350,
              width: 300,
            }}
            highlight={
              textInputMode === TextInputMode.FILTER_LIST
                ? promptMessage
                : undefined
            }
            onItemClick={handlePromptTemplateClick}
          />
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

export { BoxPrompt };
