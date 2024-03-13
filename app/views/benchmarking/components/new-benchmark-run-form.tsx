import { Form, Formik } from 'formik';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { Icon, IconName } from '@/app/components/IconSVG';

const initialFormValues: BenchmarkRunFormValues = {
  name: '',
  description: '',
  cookbooks: [],
  endpoints: [],
};

type NewBenchmarkRunFormProps = {
  addedCookbooks: Cookbook[];
  addedEndpoints: LLMEndpoint[];
  className?: string;
  onFormSubmit: (data: BenchmarkRunFormValues) => void;
};

const NewBenchMmarkRunForm: React.FC<NewBenchmarkRunFormProps> = (props) => {
  const { addedCookbooks, addedEndpoints, className, onFormSubmit } = props;

  async function handleFormSubmit(values: BenchmarkRunFormValues) {
    values.cookbooks = addedCookbooks.map((cookbook) => cookbook.id);
    values.endpoints = addedEndpoints.map((epoint) => epoint.id);
    values.num_of_prompts = '4';
    if (onFormSubmit) onFormSubmit(values);
  }

  return (
    <div className={`pl-4 w-full h-full ${className}`}>
      <Formik<BenchmarkRunFormValues>
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

              <TextArea
                name="description"
                label="Description"
                onChange={formProps.handleChange}
                value={formProps.values.description}
                error={
                  formProps.touched.description && formProps.errors.description
                    ? formProps.errors.description
                    : undefined
                }
                placeholder=""
              />

              <div className="mt-10 flex justify-start">
                <button
                  className="flex btn-primary items-center gap-2 btn-large rounded"
                  type="submit">
                  <div>Run Benchmarks</div>
                  <Icon
                    name={IconName.ArrowRight}
                    lightModeColor="#FFFFFF"
                    size={14}
                  />
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export { NewBenchMmarkRunForm };
