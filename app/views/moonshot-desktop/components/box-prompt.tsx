import Image from 'next/image';
import { TextInput } from '../../../components/textInput';
import { Window } from '../../../components/window';
import { useEffect, useState } from 'react';
import usePromptTemplateList from '../hooks/usePromptTemplateList';
import { ListItem, SelectList } from '@/app/components/selectList';
import useOutsideClick from '@/app/hooks/use-outside-click';
import { getWindowId } from '@/app/lib/window';

function BoxPrompt(props: {
  name: string;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  onCloseClick?: () => void;
  onPromptTemplateClick?: () => void;
  onSendClick: (message: string) => void;
}) {
  const { onCloseClick, onPromptTemplateClick, onSendClick, styles } = props;
  const [promptMessage, setPromptMessage] = useState('');
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  const [showPromptTemplateList, setShowPromptTemplateList] = useState(false);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  useOutsideClick(['prompt-template-list', 'box-prompt-text-input'], () =>
    setShowPromptTemplateList(false)
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

  function handlePromptTemplateClick() {
    setShowPromptTemplateList(true);
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
            placeholder="Message"
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
          <div style={{ display: 'flex ', alignItems: 'center' }}>
            <Image
              src="icons/prompt_template.svg"
              alt="close"
              width={24}
              height={24}
              style={{
                cursor: 'pointer',
                marginRight: 3,
              }}
              onClick={handlePromptTemplateClick}
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
            onItemClick={onPromptTemplateClick}
          />
        )}
      </div>
    </Window>
  );
}

export { BoxPrompt };
