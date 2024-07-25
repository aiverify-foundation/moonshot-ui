import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { object, string, array } from 'yup';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { useCreateSessionMutation } from '@/app/services/session-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import {
  resetAttackModule,
  resetRedteamModels,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';

const initialFormValues: RedteamRunFormValues = {
  name: '',
  description: '',
  endpoints: [],
  attack_module: undefined,
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  description: string(),
  endpoints: array().min(1, 'At least one endpoint is required'),
});

function RedteamRunForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const attackModule = useAppSelector((state) => state.attackModule.entity);
  const selectedEndpoints = useAppSelector(
    (state) => state.redteamModels.entities
  );
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      startRedteamSession(values);
    },
  });

  async function startRedteamSession(data: RedteamRunFormValues) {
    const response = await createSession({
      name: data.name,
      description: data.description,
      endpoints: data.endpoints,
      attack_module: data.attack_module,
    });
    if ('error' in response) {
      console.error(response.error);
      return;
    }
    dispatch(resetRedteamModels());
    dispatch(resetAttackModule());
    router.push(`/redteaming/sessions/${response.data.session.session_id}`);
  }

  useEffect(() => {
    formik.setFieldValue(
      'attack_module',
      attackModule ? attackModule.id : undefined
    );
  }, [attackModule]);

  useEffect(() => {
    formik.setFieldValue(
      'endpoints',
      selectedEndpoints.map((ep) => ep.id)
    );
  }, [selectedEndpoints]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[300px] gap-5">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
        Before you start...
      </h2>
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
          placeholder="Describe this session. E.g., purpose of the session"
        />

        <div className="flex grow gap-2 justify-center items-end mt-3">
          <Button
            disabled={isLoading || !formik.isValid}
            mode={ButtonType.PRIMARY}
            size="lg"
            type="button"
            text="Start"
            onClick={() => formik.handleSubmit()}
          />
        </div>
      </div>
    </section>
  );
}

export { RedteamRunForm };
