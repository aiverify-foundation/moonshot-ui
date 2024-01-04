import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

type JSONEditorProps = {
  placeholder: Record<string, unknown>;
};

function JSONEditor(props: JSONEditorProps) {
  const { placeholder } = props;
  return (
    <JSONInput
      id="a_unique_id"
      placeholder={placeholder}
      locale={locale}
      height="550px"
    />
  );
}

export default JSONEditor;
