import { Form, Formik } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import usePromptTemplateList from '@/app/views/moonshot-desktop/hooks/usePromptTemplateList';
import {
  useCreateSessionMutation,
  useLazySetActiveSessionQuery,
} from '@/app/services/session-api-service';
import { setActiveSession, useAppDispatch } from '@/lib/redux';

type FormValues = {
  sessionName: string;
  description: string;
  promptTemplate: string;
  llmEndpoints: string[];
};

const initialFormValues: FormValues = {
  sessionName: '',
  description: '',
  promptTemplate: '',
  llmEndpoints: [],
};

const contextStrategyOptions: SelectOption[] = [
  { value: '0', label: 'Strategy1' },
  { value: '1', label: 'Strategy2' },
  { value: '2', label: 'Strategy3' },
];

type NewSessonFormProps = {
  selectedEndpoints: LLMEndpoint[];
  onFormSubmit?: (data: FormValues) => void;
};

const NewSessionForm: React.FC<NewSessonFormProps> = (props) => {
  const { selectedEndpoints, onFormSubmit } = props;
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  const dispatch = useAppDispatch();
  const [triggerSetActiveSession] = useLazySetActiveSessionQuery();

  const [
    createSession,
    {
      data: newSession,
      isLoading: createSessionIsLoding,
      error: createSessionError,
    },
  ] = useCreateSessionMutation();

  async function submitNewSessionForm(
    name: string,
    description: string,
    endpoints: string[]
  ) {
    const response = await createSession({
      name,
      description,
      endpoints,
    });
    //@ts-ignore
    if (response.data) {
      const activeSessionResponse = await triggerSetActiveSession(
        //@ts-ignore
        response.data.session_id
      );
      if (activeSessionResponse.data) {
        dispatch(setActiveSession(activeSessionResponse.data));
      }
    } // todo - else and error handling
  }

  async function handleFormSubmit(values: FormValues) {
    values.llmEndpoints = selectedEndpoints.map((endpoint) => endpoint.name);
    console.log(values);
    submitNewSessionForm(
      values.sessionName,
      values.description,
      values.llmEndpoints
    );
    if (onFormSubmit) onFormSubmit(values);
  }

  return isLoading ? null : (
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
