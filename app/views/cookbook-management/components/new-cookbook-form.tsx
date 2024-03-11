import { Form, Formik } from 'formik';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';

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
  onFormSubmit: (data: CookbookFormValues) => void;
};

const NewCookbookForm: React.FC<NewCookbookFormProps> = ({ onFormSubmit }) => {
  async function handleFormSubmit(values: CookbookFormValues) {
    onFormSubmit(values);
  }
  return (
    <div className="p-4 w-96 h-full">
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
