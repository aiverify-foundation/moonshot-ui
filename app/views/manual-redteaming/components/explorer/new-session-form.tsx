import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import useLLMEndpointList from '@/app/views/moonshot-desktop/hooks/useLLMEndpointList';
import usePromptTemplateList from '@/app/views/moonshot-desktop/hooks/usePromptTemplateList';
import { Form, Formik } from 'formik';

type FormValues = {
  sessionName: string;
  description: string;
  promptTemplates: string[];
  llmEndpoints: string[];
};

const initialFormValues: FormValues = {
  sessionName: '',
  description: '',
  promptTemplates: [],
  llmEndpoints: [],
};

const contextStrategyOptions: SelectOption[] = [
  { value: 'Strategy1', label: 'Strategy1' },
  { value: 'Strategy2', label: 'Strategy2' },
  { value: 'Strategy2', label: 'Strategy3' },
];

type NewSessonFormProps = {
  onFormSubmit: (data: FormValues) => void;
};

const NewSessionForm: React.FC<NewSessonFormProps> = ({ onFormSubmit }) => {
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  async function handleFormSubmit(values: FormValues) {
    onFormSubmit(values);
  }
  return (
    <div className="p-4 w-96 h-full">
      <Formik<FormValues>
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}>
        {(formProps) => {
          return (
            <Form>
              <SelectInput
                label="Prompt Template"
                name="promptTemplate"
                options={promptTemplates.map((template) => ({
                  value: template.name,
                  label: template.name,
                }))}
                onSyntheticChange={formProps.handleChange}
              />

              <SelectInput
                label="Context Strategy"
                name="contextStrategy"
                options={contextStrategyOptions}
                onSyntheticChange={formProps.handleChange}
              />
              <TextInput
                name="sessionName"
                label="Session Name"
                onChange={formProps.handleChange}
                value={formProps.values.sessionName}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.sessionName && formProps.errors.sessionName
                    ? formProps.errors.sessionName
                    : undefined
                }
                placeholder="Give an identifier name to this session"
              />
              <TextArea
                name="description"
                label="Description"
                onChange={formProps.handleChange}
                error={
                  formProps.touched.description && formProps.errors.description
                    ? formProps.errors.description
                    : undefined
                }
                value={formProps.values.description}
                placeholder="Give a description of this session"
              />

              <div className="bottom-3 text-right">
                <button
                  className="btn-primary"
                  type="submit">
                  Submit
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export { NewSessionForm };
