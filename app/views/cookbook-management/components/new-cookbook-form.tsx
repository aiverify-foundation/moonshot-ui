import { Form, Formik } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { useRecipeList } from '@views/recipes-management/hooks/useRecipeList';
import { useAppDispatch } from '@/lib/redux';
import { useCreateCookbookMutation } from '@/app/services/cookbook-api-service';

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
  onFormSubmit: (data: CookbookFormValues) => void;
};

const NewCookbookForm: React.FC<NewCookbookFormProps> = (props) => {
  const { selectedRecipes, onFormSubmit } = props;
  const { recipes, error, isLoading } = useRecipeList();
  const dispatch = useAppDispatch;

  const [
    createCookbook,
    {
      data: newCookbook,
      error: createCookbookError,
      isLoading: createCookbookIsLoading,
    },
  ] = useCreateCookbookMutation();

  async function submitNewCookbookForm(
    name: string,
    description: string,
    recipes: string[]
  ) {
    const response = await createCookbook({ name, description, recipes });
    if (response.data) {
      console.info('New cookbook created', response.data);
      // TODO - do success visuals
    }
  }

  async function handleFormSubmit(values: CookbookFormValues) {
    values.recipes = selectedRecipes.map((recipe) => recipe.id);
    submitNewCookbookForm(values.name, values.description, values.recipes);
    if (onFormSubmit) onFormSubmit(values);
  }

  return (
    <div className="w-96 h-full">
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

export { NewCookbookForm };
