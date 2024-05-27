'use client';

import { useFormik } from 'formik';
import React from 'react';
import { object, string, array } from 'yup';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/views/shared-components/customColors';
import config from '@/moonshot.config';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { IconName } from '@/app/components/IconSVG';
export const dynamic = 'force-dynamic';

type CreateCookbookFormValues = {
  name: string;
  description: string;
  recipes: string[];
};

const initialFormValues: CreateCookbookFormValues = {
  name: '',
  description: '',
  recipes: [],
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  description: string(),
  recipes: array().min(1, 'At least one recipe is required'),
});

function CreateCookbookForm({ recipes }: { recipes: Recipe[] }) {
  const [selectedRecipes, setSelectedRecipes] = React.useState<Recipe[]>([]);
  const [showRecipesList, setShowRecipesList] = React.useState(false);
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO submission
    },
  });

  return (
    <main className="flex items-center justify-center min-h-[300px] gap-5">
      <div className="flex flex-col w-[50%] gap-2">
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
          labelStyles={{
            fontSize: '1rem',
            color: colors.moonpurplelight,
          }}
          inputStyles={{ height: 38 }}
          placeholder="Give this session a unique name"
        />

        <TextArea
          name="description"
          label="Description (optional)"
          labelStyles={{
            fontSize: '1rem',
            color: colors.moonpurplelight,
          }}
          onChange={formik.handleChange}
          value={formik.values.description}
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : undefined
          }
          placeholder="Describe this cookbook"
        />

        <section className="flex flex-col gap-2">
          <h2 className="text-[1.6rem] text-white">Selected Recipes</h2>
          {selectedRecipes.map((recipe) => (
            <Button
              key={recipe.id}
              leftIconName={IconName.Close}
              mode={ButtonType.PRIMARY}
              text={recipe.name}
              onClick={() => {}}
            />
          ))}
        </section>

        <div className="flex grow gap-2 justify-center items-end mt-3">
          <Button
            disabled={!formik.isValid}
            mode={ButtonType.PRIMARY}
            size="md"
            type="button"
            text="Select Recipes"
            onClick={() => formik.handleSubmit()}
          />
        </div>
      </div>
    </main>
  );
}

export { CreateCookbookForm };
