import { useFormik } from 'formik';
import { useEffect } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { object, string, number, array } from 'yup';

const initialFormValues: BenchmarkRunFormValues = {
  name: '',
  description: '',
  cookbooks: [],
  endpoints: [],
  num_of_prompts: '0',
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  description: string().required('Description is required'),
  num_of_prompts: number()
  .required('Number of Prompts is required')
  .typeError('Number of Prompts must be a number')
  .min(0, 'Number of Prompts cannot be a negative number'),
  cookbooks: array()
    .min(1, 'At least one cookbook is required'),
  endpoints: array()
    .min(1, 'At least one endpoint is required'),
});

type NewBenchmarkRunformik = {
  addedCookbooks: Cookbook[];
  addedEndpoints: LLMEndpoint[];
  className?: string;
  onFormSubmit: (data: BenchmarkRunFormValues) => void;
};

const NewBenchMarkRunForm: React.FC<NewBenchmarkRunformik> = (props) => {
  const { addedCookbooks, addedEndpoints, className, onFormSubmit } = props;
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const submitEnabled =
    formik.isValid &&
    addedCookbooks.length &&
    addedEndpoints.length;

  async function handleFormSubmit(values: BenchmarkRunFormValues) {
    if (onFormSubmit) onFormSubmit(values);
  }

  useEffect(() => {
    formik.setFieldValue(
      'cookbooks',
      addedCookbooks.map((cb) => cb.id)
    );
  }, [addedCookbooks]);

  useEffect(() => {
    formik.setFieldValue(
      'endpoints',
      addedEndpoints.map((ep) => ep.id)
    );
  }, [addedEndpoints]);

  return (
    <div className={`pl-4 w-full h-full ${className}`}>
      <TextInput
        name="name"
        label="Name"
        onChange={formik.handleChange}
        value={formik.values.name}
        onBlur={formik.handleBlur}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        placeholder="Name of this benchmark run"
      />

      <TextArea
        name="description"
        label="Description"
        onChange={formik.handleChange}
        value={formik.values.description}
        error={
          formik.touched.name && formik.errors.description
            ? formik.errors.description
            : undefined
        }
        placeholder="Description of this benchmark run"
      />

      <TextInput
        name="num_of_prompts"
        label="Number of Prompts (0 for Maximum)"
        onChange={formik.handleChange}
        value={formik.values.num_of_prompts}
        onBlur={formik.handleBlur}
        error={
          formik.touched.name && formik.errors.num_of_prompts
            ? formik.errors.num_of_prompts
            : undefined
        }
        placeholder="Number of prompts to send to the model (out of number of items in dataset)"
      />

      <div className="mt-10 flex justify-start">
        <button
          disabled={!submitEnabled}
          className="flex btn-primary items-center gap-2 btn-large rounded"
          type="button"
          onClick={() => formik.handleSubmit()}>
          <div>Run Benchmarks</div>
          <Icon
            name={IconName.ArrowRight}
            lightModeColor="#FFFFFF"
            size={14}
          />
        </button>
      </div>
    </div>
  );
};

export { NewBenchMarkRunForm };
