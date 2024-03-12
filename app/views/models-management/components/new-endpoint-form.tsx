import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextInput } from '@/app/components/textInput';
import { Form, Formik } from 'formik';

export type LLMEndpointFormValues = {
  type: string;
  name: string;
  uri: string;
  token: string;
  maxCallsPerSecond: string;
  maxConcurrency: string;
  params?: Record<string, number | string>;
};

const initialFormValues: LLMEndpointFormValues = {
  type: '',
  name: '',
  uri: '',
  token: '',
  maxCallsPerSecond: '10',
  maxConcurrency: '1',
  params: {},
};

const maxConcurrencyOptions: SelectOption[] = Array.from(
  { length: 10 },
  (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })
);

const maxCallsPerSecondOptions: SelectOption[] = Array.from(
  { length: 10 },
  (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  })
);

const connectionTypeOptions: SelectOption[] = [
  { value: 'hf-gpt2', label: 'hf-gpt2' },
  { value: 'hf-llama2-13b-gptq', label: 'hf-llama2-13b-gptq' },
  { value: 'claude2', label: 'calude2' },
  { value: 'openai-gpt35', label: 'openai-gpt35' },
  { value: 'openai-gpt4', label: 'openai-gpt4' },
];

type NewModelEndpointFormProps = {
  className?: string;
  onFormSubmit: (data: LLMEndpointFormValues) => void;
};

const NewModelEndpointForm: React.FC<NewModelEndpointFormProps> = (props) => {
  const { className, onFormSubmit } = props;
  async function handleFormSubmit(values: LLMEndpointFormValues) {
    onFormSubmit(values);
  }
  return (
    <div className={`pl-4 w-full h-full ${className}`}>
      <Formik<LLMEndpointFormValues>
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}>
        {(formProps) => {
          return (
            <Form>
              <TextInput
                name="name"
                label="Name"
                onChange={formProps.handleChange}
                value={formProps.values.name}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.name && formProps.errors.name
                    ? formProps.errors.name
                    : undefined
                }
                placeholder=""
              />
              <SelectInput
                label="Connection Type"
                name="type"
                options={connectionTypeOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.type}
              />
              <TextInput
                name="uri"
                label="URI"
                onChange={formProps.handleChange}
                value={formProps.values.uri}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.uri && formProps.errors.uri
                    ? formProps.errors.uri
                    : undefined
                }
                placeholder=""
              />
              <TextInput
                name="token"
                label="Token"
                onChange={formProps.handleChange}
                value={formProps.values.token}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.token && formProps.errors.token
                    ? formProps.errors.token
                    : undefined
                }
                placeholder=""
              />
              <SelectInput
                label="Max Calls Per Second"
                name="maxCallsPerSecond"
                options={maxCallsPerSecondOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.maxCallsPerSecond}
              />
              <SelectInput
                label="Max Concurrency"
                name="maxConcurrency"
                options={maxConcurrencyOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.maxConcurrency}
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

export { NewModelEndpointForm };
