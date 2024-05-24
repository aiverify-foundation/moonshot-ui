import { Form, Formik } from 'formik';
import { object, string } from 'yup';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
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
  clearWindows,
  resetBenchmarkModels,
  setActiveSession,
  useAppDispatch,
} from '@/lib/redux';
import tailwindConfig from '@/tailwind.config';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type FormValues = {
  sessionName: string;
  description: string;
  promptTemplate: string;
  llmEndpoints: string[];
  context_strategy: string;
};

const validationSchema = object().shape({
  sessionName: string().required('Session Name is required'),
  description: string().required('Description is required'),
});

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

const SessionDetailsForm: React.FC<NewSessonFormProps> = (props) => {
  const { selectedEndpoints, onFormSubmit } = props;
  const {
    promptTemplates,
    isLoading: isPrompTemplatesLoading,
  } = usePromptTemplateList();
  const dispatch = useAppDispatch();

  const {
    data: contextStrategies = [],
    isLoading: isCtxLoading,
  } = useGetAllContextStrategiesQuery();

  let contextStrategySelectOptions: SelectOption[] = [];
  if (contextStrategies && contextStrategies.length) {
    contextStrategySelectOptions = contextStrategies.map((strategy) => ({
      value: strategy.id,
      label: strategy.name,
    }));
  }

  const [ createSession ] = useCreateSessionMutation();

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
    dispatch(clearWindows());
    dispatch(resetBenchmarkModels());
    if (onFormSubmit) onFormSubmit(values);
  }

  return (
    <div className="relative pl-4 pt-8 pb-8 w-full h-full min-h-[300px]">
      {isPrompTemplatesLoading || isCtxLoading ? (
        <div className="ring">
          Loading
          <span />
        </div>
      ) : (
        <Formik<FormValues>
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {(formProps) => {
            return (
              <Form className="w-full h-full flex flex-col px-[20%] justify-center items-center">
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
                      formProps.touched.sessionName &&
                      formProps.errors.description
                        ? formProps.errors.description
                        : undefined
                    }
                    value={formProps.values.description}
                    placeholder="Provide a description of this session"
                  />
                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      btnColor={colors.moongray[900]}
                      textColor={colors.white}
                      mode={ButtonType.PRIMARY}
                      text="Start Red Teaming Session"
                      rightIconName={IconName.ArrowRight}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export { SessionDetailsForm };
