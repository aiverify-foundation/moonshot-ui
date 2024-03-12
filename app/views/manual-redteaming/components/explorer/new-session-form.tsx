import { Form, Formik } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { getWindowId } from '@/app/lib/window-utils';
import { useCreateSessionMutation } from '@/app/services/session-api-service';
import { WindowIds } from '@/app/views/moonshot-desktop/constants';
import usePromptTemplateList from '@/app/views/moonshot-desktop/hooks/usePromptTemplateList';
import {
  addOpenedWindowId,
  setActiveSession,
  useAppDispatch,
} from '@/lib/redux';

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
      dispatch(setActiveSession(response.data));
      dispatch(addOpenedWindowId(getWindowId(WindowIds.RED_TEAMING_SESSION)));
    } // todo - else and error handling
  }

  async function handleFormSubmit(values: FormValues) {
    values.llmEndpoints = selectedEndpoints.map((endpoint) => endpoint.name);
    submitNewSessionForm(
      values.sessionName,
      values.description,
      values.llmEndpoints
    );
    if (onFormSubmit) onFormSubmit(values);
  }

  return isLoading ? null : (
    <div className="pl-4 pt-8 w-full h-full">
      <Formik<FormValues>
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}>
        {(formProps) => {
          return (
            <Form className="w-full h-full flex flex-col">
              <div className="flex divide-x divide-fuchsia-100/40 w-full h-full gap-6">
                <div className="flex-0 basis-[55%] h-full">
                  <SelectInput
                    label="Prompt Template"
                    name="promptTemplate"
                    placeholder="Select a prompt template"
                    description="Templates enable you to wrap your prompts with a pre or post prompt automatically.
                    Using a prompt template is optional and can be changed while red teaming is in progress."
                    options={promptTemplates.map((template) => ({
                      value: template.name,
                      label: template.name,
                    }))}
                    onSyntheticChange={formProps.handleChange}
                  />

                  <SelectInput
                    label="Context Strategy"
                    name="contextStrategy"
                    placeholder="Select a context strategy"
                    description="Context strategies define how previous prompts will be included in the current prompt, 
                    such as appending a newly summarized context with each prompt. Using a context strategy is optional 
                    and can be changed while red teaming is in progress."
                    options={contextStrategyOptions}
                    onSyntheticChange={formProps.handleChange}
                  />
                </div>
                <div className="flex-1 pl-4 h-full flex flex-col justify-end">
                  <TextInput
                    name="sessionName"
                    label="Session Name"
                    onChange={formProps.handleChange}
                    value={formProps.values.sessionName}
                    onBlur={formProps.handleBlur}
                    error={
                      formProps.touched.sessionName &&
                      formProps.errors.sessionName
                        ? formProps.errors.sessionName
                        : undefined
                    }
                    placeholder="Add an identifier name to this session"
                  />
                  <TextArea
                    name="description"
                    label="Description"
                    onChange={formProps.handleChange}
                    error={
                      formProps.touched.description &&
                      formProps.errors.description
                        ? formProps.errors.description
                        : undefined
                    }
                    value={formProps.values.description}
                    placeholder="Provide a description of this session"
                  />
                  <div className="text-right mt-6">
                    <button
                      className="btn-primary btn-large rounded"
                      type="submit">
                      Start Red Teaming Session
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export { NewSessionForm };
