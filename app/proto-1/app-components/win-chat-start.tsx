import React, { useState } from 'react';
import { TextInput } from '../component-lib/textInput';
import { Window } from '../component-lib/window';
import { CheckBox } from '../component-lib/checkbox';
import { TextArea } from '../component-lib/textArea';

type WindowChatStartProps = {
  onCloseClick: () => void;
  onStartClick: () => void;
};

function WindowChatStart(props: WindowChatStartProps) {
  const { onCloseClick, onStartClick } = props;
  const [sessionName, setSessionName] = useState('');
  const [sessionDesc, setSessionDesc] = useState('');
  const [selectedLLMEndpoints, setSelectedLLMEndpoints] = useState<string[]>(
    []
  );

  function handleSessionNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSessionName(e.target.value);
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSessionDesc(e.target.value);
  }

  function handleLLMEndpointChange(e: React.ChangeEvent<HTMLInputElement>) {
    const updateList = [...selectedLLMEndpoints];
    const foundIdx = updateList.findIndex(
      (llmName) => llmName === e.target.value
    );
    if (foundIdx > -1) {
      updateList.splice(foundIdx, 1);
      setSelectedLLMEndpoints(updateList);
    } else {
      updateList.push(e.target.value);
      setSelectedLLMEndpoints(updateList);
    }
  }

  return (
    <Window
      initialXY={[600, 200]}
      name="Start New Session"
      styles={{ width: 600, height: 470 }}
      onCloseClick={onCloseClick}>
      <div
        style={{
          color: 'gray',
          padding: 15,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}>
        <TextInput
          name="sessionName"
          label="Session Name"
          onChange={handleSessionNameChange}
          value={sessionName}
          placeholder="Give an identifier name to this session"
        />
        <TextArea
          name="description"
          label="Description"
          onChange={handleDescriptionChange}
          value={sessionDesc}
          placeholder="Give a description of this session"
        />
        <div
          style={{
            color: '#676767',
            fontWeight: 600,
            marginBottom: 4,
            fontSize: 13,
          }}>
          LLM Endpoints
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid lightgray',
            padding: 15,
            borderRadius: 5,
            position: 'relative',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 15,
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 20,
            }}>
            <CheckBox
              style={{ marginBottom: 0 }}
              label="OpenAI-GPT35"
              name="openAI-GPT35"
              checked={selectedLLMEndpoints.indexOf('openAI-GPT35') > -1}
              onChange={handleLLMEndpointChange}
              value="openAI-GPT35"
            />
            <CheckBox
              style={{ marginBottom: 0 }}
              label="OpenAI-GPT4"
              name="openAI-GPT35"
              checked={selectedLLMEndpoints.indexOf('openAI-GPT4') > -1}
              onChange={handleLLMEndpointChange}
              value="openAI-GPT4"
            />
            <CheckBox
              style={{ marginBottom: 0 }}
              label="Claude2"
              name="claude2"
              onChange={handleLLMEndpointChange}
              checked={selectedLLMEndpoints.indexOf('claude2') > -1}
              value="claude2"
            />
            <CheckBox
              style={{ marginBottom: 0 }}
              label="llama2"
              name="llama2"
              onChange={handleLLMEndpointChange}
              checked={selectedLLMEndpoints.indexOf('llama2') > -1}
              value="llama2"
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 20,
            }}>
            <CheckBox
              style={{ marginBottom: 0 }}
              label="Bard"
              name="bard"
              onChange={handleLLMEndpointChange}
              checked={selectedLLMEndpoints.indexOf('bard') > -1}
              value="bard"
            />
          </div>
        </div>
        <div
          style={{
            width: 'calc(100% - 30px)',
            position: 'absolute',
            bottom: 10,
            textAlign: 'right',
          }}>
          <button
            style={{
              minWidth: 100,
              border: '1px solid #cfcfcf',
              padding: '5px 15px',
              background: '#1189b9',
              color: '#FFF',
              fontSize: 13,
            }}
            type="button"
            onClick={onStartClick}>
            Start
          </button>
        </div>
      </div>
    </Window>
  );
}

export { WindowChatStart };
