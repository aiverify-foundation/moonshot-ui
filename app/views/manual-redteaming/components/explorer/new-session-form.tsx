import { Form, Formik } from 'formik';
import { Icon, IconName } from '@/app/components/IconSVG';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { getWindowId } from '@/app/lib/window-utils';
import { useGetAllContextStrategiesQuery } from '@/app/services/contextstrat-api-service';
import { useCreateSessionMutation } from '@/app/services/session-api-service';
import { WindowIds } from '@/app/views/moonshot-desktop/constants';
import usePromptTemplateList from '@/app/views/moonshot-desktop/hooks/usePromptTemplateList';
import {
  addOpenedWindowId,
  removeOpenedWindowId,
  resetBenchmarkModels,
  setActiveSession,
  useAppDispatch,
} from '@/lib/redux';

type FormValues = {
  sessionName: string;
  description: string;
  promptTemplate: string;
  llmEndpoints: string[];
  context_strategy: string;
};

const initialFormValues: FormValues = {
  sessionName: '',
  description: '',
  promptTemplate: '',
  llmEndpoints: [],
  context_strategy: '',
};

type NewSessonFormProps = {
  selectedEndpoints: LLMEndpoint[];
  onFormSubmit?: (data: FormValues) => void;
};

const NewSessionForm: React.FC<NewSessonFormProps> = (props) => {
  const { selectedEndpoints, onFormSubmit } = props;
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  const dispatch = useAppDispatch();

  const {
    data: contextStrategies,
    error: ctxErrors,
    isLoading: ctxIsLoading,
    refetch: ctxRefetch,
  } = useGetAllContextStrategiesQuery();

  let contextStrategySelectOptions: SelectOption[] = [];
  if (contextStrategies && contextStrategies.length) {
    contextStrategySelectOptions = contextStrategies.map((strategy) => ({
      value: strategy,
      label: strategy,
    }));
  }

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
    endpoints: string[],
    prompt_template: string,
    context_strategy: string
  ) {
    const response = await createSession({
      name,
      description,
      endpoints,
      prompt_template,
      context_strategy,
    });
    //@ts-ignore
    if (response.data) {
      //@ts-ignore
      dispatch(setActiveSession(response.data));
      dispatch(addOpenedWindowId(getWindowId(WindowIds.RED_TEAMING_SESSION)));
    } // todo - else and error handling
  }

  async function handleFormSubmit(values: FormValues) {
    values.llmEndpoints = selectedEndpoints.map((endpoint) => endpoint.id);
    submitNewSessionForm(
      values.sessionName,
      values.description,
      values.llmEndpoints,
      values.promptTemplate,
      values.context_strategy
    );
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.SESSION_FORM)));
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.SAVED_SESSIONS)));
    dispatch(resetBenchmarkModels());
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
                    name="context_strategy"
                    placeholder="Select a context strategy"
                    description="Context strategies define how previous prompts will be included in the current prompt, 
                    such as appending a newly summarized context with each prompt. Using a context strategy is optional 
                    and can be changed while red teaming is in progress."
                    options={contextStrategySelectOptions}
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
                  <div className="flex justify-end mt-6">
                    <button
                      className="flex btn-primary items-center gap-2 btn-large rounded"
                      type="submit">
                      <div>Start Red Teaming Session</div>
                      <Icon
                        name={IconName.ArrowRight}
                        lightModeColor="#FFFFFF"
                        size={14}
                      />
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
