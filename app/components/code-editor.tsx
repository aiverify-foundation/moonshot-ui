import Editor from '@monaco-editor/react';
import React from 'react';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function CodeEditor() {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  );
}

export { CodeEditor };
