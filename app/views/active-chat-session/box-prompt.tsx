import Image from 'next/image';
import { TextInput } from '../../components/textInput';
import { Window } from '../../components/window';
import { useEffect, useState } from 'react';
import usePromptTemplateList from '../moonshot-desktop/hooks/usePromptTemplateList';
import { ListItem, SelectList } from '@/app/components/selectList';
import useOutsideClick from '@/app/hooks/use-outside-click';
import { getWindowId } from '@/app/lib/window';

enum TextInputMode {
  PROMPT_LLM,
  SLASH_COMMAND,
  FILTER_LIST,
}

function BoxPrompt(props: {
  name: string;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  onCloseClick?: () => void;
  onSelectPromptTemplate: (item: PromptTemplate) => void;
  onSendClick: (message: string) => void;
}) {
  const { onCloseClick, onSelectPromptTemplate, onSendClick, styles } = props;
  const [promptMessage, setPromptMessage] = useState('');
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  const [showPromptTemplateList, setShowPromptTemplateList] = useState(false);
  const [textInputMode, setTextInputMode] = useState<TextInputMode>(TextInputMode.PROMPT_LLM);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<PromptTemplate>();
  const [listItems, setListItems] = useState<ListItem[]>([]);
  useOutsideClick(
    ['prompt-template-list', 'box-prompt-text-input', 'prompt-template-trigger'],
    () => {
      setShowPromptTemplateList(false);
      if (textInputMode === TextInputMode.FILTER_LIST) {
        setPromptMessage('');
        setTextInputMode(TextInputMode.PROMPT_LLM);
      }
    }
  );

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPromptMessage(e.target.value);
  }

  function handleOnSendMessageClick() {
    onSendClick(promptMessage);
    setPromptMessage('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleOnSendMessageClick();
      e.preventDefault();
    }
  }

  function handleTogglePromptTemplateList() {
    setShowPromptTemplateList((prev) => !prev);
    setTextInputMode(TextInputMode.FILTER_LIST);
  }

  function handlePromptTemplateClick(item: ListItem) {
    const selected = promptTemplates.find((pt) => pt.name === item.id);
    setSelectedPromptTemplate(selected);
    if (selected) {
      onSelectPromptTemplate(selected);
    }
    setShowPromptTemplateList(false);
  }

  useEffect(() => {
    const list: ListItem[] = promptTemplates.map((pt) => ({ id: pt.name, displayName: pt.name }));
    setListItems(list);
  }, [promptTemplates]);

  return (
    <Window
      id={getWindowId('box-prompt')}
      initialXY={[600, 600]}
      initialWindowSize={[500, 115]}
      resizeable={false}
      name="Prompt"
      onCloseClick={onCloseClick}
      styles={{ overflow: 'show', ...styles }}
      contentAreaStyles={{
        background: 'none',
        padding: 0,
        overflowY: 'visible',
        overflowX: 'visible',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <TextInput
            id="box-prompt-text-input"
            name="sessionName"
            placeholder={
              textInputMode === TextInputMode.FILTER_LIST ? 'Search Prompt Templates' : 'Message'
            }
            style={{ width: 400 }}
            onChange={handleTextChange}
            value={promptMessage}
            onKeyDown={handleKeyDown}
          />
          <button
            style={{
              minWidth: 80,
              border: '1px solid #cfcfcf',
              padding: '5px 15px',
              background: '#1189b9',
              color: '#FFF',
              fontSize: 13,
              borderRadius: 4,
              height: 33,
            }}
            type="button"
            onClick={handleOnSendMessageClick}>
            Send
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div
            id="prompt-template-trigger"
            style={{ display: 'flex ', alignItems: 'center', cursor: 'pointer' }}
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
            <div style={{ fontSize: 11 }}> Prompt Template </div>
          </div>
          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="icons/context_strategy_icon.svg"
              alt="close"
              width={23}
              height={23}
              style={{
                cursor: 'pointer',
                marginRight: 3,
              }}
            />
            <div style={{ fontSize: 11 }}> Context Strategy </div>
          </div> */}
        </div>
        {showPromptTemplateList && (
          <SelectList
            id="prompt-template-list"
            data={listItems}
            styles={{ position: 'absolute', top: -90, left: 350, width: 300 }}
            highlight={textInputMode === TextInputMode.FILTER_LIST ? promptMessage : undefined}
            onItemClick={handlePromptTemplateClick}
          />
        )}
      </div>
    </Window>
  );
}

export { BoxPrompt };
