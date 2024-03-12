import { Form, Formik } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { useCreateCookbookMutation } from '@/app/services/cookbook-api-service';
import { useAppDispatch } from '@/lib/redux';
import { useRecipeList } from '@views/recipes-management/hooks/useRecipeList';

export type CookbookFormValues = {
  name: string;
  description: string;
  recipes: string[];
};

const initialFormValues: CookbookFormValues = {
  name: '',
  description: '',
  recipes: [],
};

type NewCookbookFormProps = {
  selectedRecipes: Recipe[];
  className?: string;
  onFormSubmit: (data: CookbookFormValues) => void;
};

const NewCookbookForm: React.FC<NewCookbookFormProps> = (props) => {
  const { selectedRecipes, className, onFormSubmit } = props;

  async function handleFormSubmit(values: CookbookFormValues) {
    values.recipes = selectedRecipes.map((recipe) => recipe.id);
    if (onFormSubmit) onFormSubmit(values);
  }

  return (
    <div className={`pl-4 w-full h-full ${className}`}>
      <Formik<CookbookFormValues>
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

              {/* <SelectInput
                label="Max Calls Per Second"
                name="maxCallsPerSecond"
                options={maxCallsPerSecondOptions}
                onSyntheticChange={formProps.handleChange}
                value={formProps.values.maxCallsPerSecond}
              /> */}
              <div className="bottom-3 text-right">
                <button
                  className="btn-primary btn-large rounded"
                  type="submit">
                  Save Cookbook
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export { NewCookbookForm };
