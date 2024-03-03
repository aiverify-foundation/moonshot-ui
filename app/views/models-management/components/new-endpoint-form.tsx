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

type NewModelEndpointFormProps = {
  onFormSubmit: (data: LLMEndpointFormValues) => void;
};

const NewModelEndpointForm: React.FC<NewModelEndpointFormProps> = ({
  onFormSubmit,
}) => {
  async function handleFormSubmit(values: LLMEndpointFormValues) {
    console.log(values);
    onFormSubmit(values);
  }
  return (
    <div className="p-4 w-96 h-full">
      <Formik<LLMEndpointFormValues>
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}>
        {(formProps) => {
          return (
            <Form>
              <TextInput
                name="type"
                label="Connection Type"
                onChange={formProps.handleChange}
                value={formProps.values.type}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.type && formProps.errors.type
                    ? formProps.errors.type
                    : undefined
                }
                placeholder=""
              />
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
              />
              <SelectInput
                label="Max Concurrency"
                name="maxConcurrency"
                options={maxConcurrencyOptions}
                onSyntheticChange={formProps.handleChange}
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
