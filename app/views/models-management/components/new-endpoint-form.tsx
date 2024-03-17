import { Form, Formik, FormikHelpers } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';

const requiredFields = [
  'name',
  'token',
  'connector_type',
  'max_calls_per_second',
  'max_concurrency',
];

function areRequiredFieldsFilled(values: LLMEndpointFormValues): boolean {
  return requiredFields.every((field) =>
    Boolean(values[field as keyof LLMEndpointFormValues])
  );
}

const initialFormValues: LLMEndpointFormValues = {
  connector_type: '',
  name: '',
  uri: '',
  token: '',
  max_calls_per_second: '10',
  max_concurrency: '1',
  params: '',
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

type NewModelEndpointFormProps = {
  className?: string;
  onFormSubmit: (data: LLMEndpointFormValues) => void;
};

const NewModelEndpointForm: React.FC<NewModelEndpointFormProps> = (props) => {
  const { className, onFormSubmit } = props;
  const { data, isLoading, error, refetch } = useGetAllConnectorsQuery();
  async function handleFormSubmit(
    values: LLMEndpointFormValues,
    { setFieldError }: FormikHelpers<LLMEndpointFormValues>
  ) {
    let isValid = true;
    if (values.params && values.params.trim() !== '') {
      try {
        values.params = JSON.parse(values.params);
      } catch (e) {
        console.error(e);
        isValid = false;
        setFieldError('params', 'Invalid JSON format');
      }
    }
    if (isValid) {
      onFormSubmit(values);
    }
  }
  const connectionTypeOptions: SelectOption[] =
    data?.map((connector) => ({
      value: connector,
      label: connector,
    })) || [];

  return isLoading ? null : (
    <div className={`pl-4 w-full h-full ${className}`}>
      <Formik<LLMEndpointFormValues>
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}>
        {(formProps) => {
          const submitEnabled = areRequiredFieldsFilled(formProps.values);
          return (
            <Form>
              <TextInput
                name="name"
                label="Name *"
                onChange={formProps.handleChange}
                value={formProps.values.name}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.name && formProps.errors.name
                    ? formProps.errors.name
                    : undefined
                }
                placeholder="A name for the model"
              />
              <SelectInput
                label="Connection Type *"
                name="connector_type"
                options={connectionTypeOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.connector_type}
                placeholder="Select the connector type"
              />
              <TextInput
                name="uri"
                label="URI *"
                onChange={formProps.handleChange}
                value={formProps.values.uri}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.uri && formProps.errors.uri
                    ? formProps.errors.uri
                    : undefined
                }
                placeholder="URI of the remote model endpoint"
              />
              <TextInput
                name="token"
                label="Token *"
                onChange={formProps.handleChange}
                value={formProps.values.token}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.token && formProps.errors.token
                    ? formProps.errors.token
                    : undefined
                }
                placeholder="Access token for the remote model endpoint"
              />
              <SelectInput
                label="Max Calls Per Second *"
                name="max_calls_per_second"
                options={maxCallsPerSecondOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.max_calls_per_second}
              />
              <SelectInput
                label="Max Concurrency *"
                name="max_concurrency"
                options={maxConcurrencyOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.max_concurrency}
              />
              <TextArea
                label="Other Parameters"
                name="params"
                onChange={formProps.handleChange}
                value={formProps.values.params}
                error={
                  formProps.touched.params && formProps.errors.params
                    ? formProps.errors.params
                    : undefined
                }
                placeholder='Additional params normally in JSON format. Example: { "param1": "value1", "param2": "value2" }'
              />
              <div className="mt-10 flex justify-between">
                <div className="text-sm">* Required</div>
                <button
                  disabled={!submitEnabled}
                  className="flex btn-primary items-center gap-2 btn-large rounded"
                  type="submit">
                  <div>Save Model</div>
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
