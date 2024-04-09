
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';
import { object, string, array } from 'yup';

const initialFormValues: LLMEndpointFormValues = {
  connector_type: '',
  name: '',
  uri: '',
  token: '',
  max_calls_per_second: '10',
  max_concurrency: '1',
  params: '',
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  token: string().required('Token is required'),
  connector_type: string().required('Connector Type is required'),
  max_calls_per_second: string().required('Max calls Per Second is required'),
  max_concurrency: string().required('Max Concurrency is required'),
});

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
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

const submitEnabled = formik.isValid

async function handleFormSubmit(values: LLMEndpointFormValues) {
  if (onFormSubmit) onFormSubmit(values);
}

const [connectionTypeOptions, setConnectionTypeOptions] = useState<SelectOption[]>([]);
const { data, isLoading, error, refetch } = useGetAllConnectorsQuery();

useEffect(() => {
  if (data) {
    const options: SelectOption[] = data.map((connector) => ({
      value: connector,
      label: connector,
    }));
    setConnectionTypeOptions(options);
  }
}, [data]);

return (
  <div className={`pl-4 w-full h-full ${className}`}>
        <TextInput
          name="name"
          label="Name"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
          placeholder="Name of the model"
        />
        <TextInput
        name="uri"
        label="URI"
        onChange={formik.handleChange}
        value={formik.values.uri}
        onBlur={formik.handleBlur}
        error={formik.touched.uri && formik.errors.uri ? formik.errors.uri : undefined}
        placeholder="URI of the remote model endpoint"
      />

      <TextInput
        name="token"
        label="Token"
        onChange={formik.handleChange}
        value={formik.values.token}
        onBlur={formik.handleBlur}
        error={formik.touched.token && formik.errors.token ? formik.errors.token : undefined}
        placeholder="Access token for the remote model endpoint"
      />

      <SelectInput
        label="Connector Type"
        name="connector_type"
        options={connectionTypeOptions}
        onSyntheticChange={formik.handleChange}
        value={formik.values.connector_type}
        placeholder="Select the connector type"
      />

      <SelectInput
        label="Max Calls Per Second"
        name="max_calls_per_second"
        options={maxCallsPerSecondOptions}
        onSyntheticChange={formik.handleChange}
        value={formik.values.max_calls_per_second}
      />

      <SelectInput
        label="Max Concurrency"
        name="max_concurrency"
        options={maxConcurrencyOptions}
        onSyntheticChange={formik.handleChange}
        value={formik.values.max_concurrency}
      />

      <TextArea
        label="Other Parameters"
        name="params"
        onChange={formik.handleChange}
        value={formik.values.params}
        error={formik.touched.params && formik.errors.params ? formik.errors.params : undefined}
        placeholder="Additional parameters normally in JSON format"
      />

      <div className="mt-10 flex justify-between">
        <div className="text-sm">* Required</div>
        <button
          disabled={!submitEnabled}
          className="flex btn-primary items-center gap-2 btn-large rounded"
          type="submit"
          onClick={() => formik.handleSubmit()}
        >
          <div>Save Model</div>
        </button>
      </div>
    </div>
  );
};
export { NewModelEndpointForm };
