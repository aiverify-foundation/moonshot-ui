import { useFormik } from 'formik';
import { useEffect } from 'react';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { object, string, array } from 'yup';

const initialFormValues: CookbookFormValues = {
  name: '',
  description: '',
  recipes: [],
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  description: string().required('Description is required'),
  recipes: array()
    .min(1, 'At least one recipe is required'),
});

type NewCookbookformik = {
  selectedRecipes: Recipe[];
  className?: string;
  onFormSubmit: (data: CookbookFormValues) => void;
};

const NewCookbookForm: React.FC<NewCookbookformik> = (props) => {
  const { selectedRecipes, className, onFormSubmit } = props;
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });
  const submitEnabled =
  formik.isValid &&
  selectedRecipes.length;

  async function handleFormSubmit(values: CookbookFormValues) {
    if (onFormSubmit) onFormSubmit(values);
  }

  useEffect(() => {
    formik.setFieldValue(
      'recipes',
      selectedRecipes.map((recipe) => recipe.id)
    );
  }, [selectedRecipes]);

  return (
    <div className={`pl-4 w-full h-full ${className}`}>
      <TextInput
        name="name"
        label="Name *"
        onChange={formik.handleChange}
        value={formik.values.name}
        onBlur={formik.handleBlur}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        placeholder=""
      />

      <TextArea
        name="description"
        label="Description *"
        onChange={formik.handleChange}
        value={formik.values.description}
        error={
          formik.touched.name && formik.errors.description
            ? formik.errors.description
            : undefined
        }
        placeholder=""
      />

      <div className="mt-10 flex justify-between">
        <div className="text-sm">* Required</div>
        <button
          disabled={!submitEnabled}
          className="flex btn-primary items-center gap-2 btn-large rounded"
          type="button"
          onClick={() => formik.handleSubmit()}>
          <div>Save Cookbook</div>
        </button>
      </div>
    </div>
  );
};

export { NewCookbookForm };
