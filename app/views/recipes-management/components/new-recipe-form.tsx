import { Form, Formik } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';

export type RecipeFormValues = {
  name: string;
  description: string;
  tags: string[];
  datasets: string[];
  prompt_templates: string[];
  metrics: string[];
};

const initialFormValues: RecipeFormValues = {
  name: '',
  description: '',
  tags: [],
  datasets: [],
  prompt_templates: [],
  metrics: [],
};

type NewRecipeFormProps = {
  onFormSubmit: (data: RecipeFormValues) => void;
};

const NewRecipeForm: React.FC<NewRecipeFormProps> = ({ onFormSubmit }) => {
  async function handleFormSubmit(values: RecipeFormValues) {
    onFormSubmit(values);
  }
  return (
    <div className="p-4 w-96 h-full">
      <Formik<RecipeFormValues>
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

              {/* <TextInput
                name="Tags"
                label="tags"
                onChange={formProps.handleChange}
                value={formProps.values.tags.join(',')}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.tags && formProps.errors.tags
                    ? formProps.errors.tags
                    : undefined
                }
                placeholder=""
              /> */}

              <TextArea
                name="description"
                label="description"
                onChange={formProps.handleChange}
                value={formProps.values.description}
                error={
                  formProps.touched.description && formProps.errors.description
                    ? formProps.errors.description
                    : undefined
                }
                placeholder=""
              />

              {/* <SelectInput
                label="Datasets"
                name="datasets"
                options={[]}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.datasets}
              /> */}
              {/* <SelectInput
                label="Prompt Templates"
                name="prompt_templates"
                options={[]}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.prompt_templates}
              /> */}
              {/* <SelectInput
                label="Metrics"
                name="metrics"
                options={[]}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.metrics}
              /> */}
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

export { NewRecipeForm };
