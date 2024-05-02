import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { object, string } from 'yup';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { PopupSurface } from '@/app/views/shared-components/popupSurface/popupSurface';
import { Button, ButtonType } from '@/app/components/button';
import { useCreateLLMEndpointMutation } from '@/app/services/llm-endpoint-api-service';

const initialFormValues: LLMEndpointFormValues = {
  connector_type: '',
  name: '',
  uri: '',
  token: '',
  max_calls_per_second: '10',
  max_concurrency: '1',
  params: '{}',
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  token: string().required('Token is required'),
  connector_type: string().required('Connector Type is required'),
  max_calls_per_second: string().required('Max calls Per Second is required'),
  max_concurrency: string().required('Max Concurrency is required'),
});

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

type NewEndpointFormProps = {
  onClose: () => void;
};

function NewEndpointForm(props: NewEndpointFormProps) {
  const { onClose } = props;
  const [showMoreConfig, setShowMoreConfig] = useState(false);

  const [
    createModelEndpoint,
    {
      data: newModelEndpoint,
      isLoading: createModelEndpointIsLoding,
      error: createModelEndpointError,
    },
  ] = useCreateLLMEndpointMutation();

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.dir(values);
      const result = await submitNewEndpoint(values);
      console.dir(result);
      onClose();
    },
  });

  const submitEnabled = formik.isValid;

  async function submitNewEndpoint(data: LLMEndpointFormValues) {
    const newModelEndpoint = {
      connector_type: data.connector_type,
      name: data.name,
      uri: data.uri,
      token: data.token,
      max_calls_per_second: data.max_calls_per_second,
      max_concurrency: data.max_concurrency,
      params: data.params,
    };
    const response = await createModelEndpoint(newModelEndpoint);
    if ('error' in response) {
      console.error(response.error);
      //TODO - create error visuals
      return;
    }
  }

  const [connectionTypeOptions, setConnectionTypeOptions] = useState<
    SelectOption[]
  >([]);
  const { data, isLoading, error, refetch } = useGetAllConnectorsQuery();

  useEffect(() => {
    if (data) {
      const options: SelectOption[] = data.map((connector) => ({
        value: connector,
        label: connector,
      }));
      setConnectionTypeOptions(options);
    }
  }, [data]);

  return (
    <div className="flex flex-col pt-4 w-full h-full">
      <PopupSurface
        height="100%"
        onCloseIconClick={onClose}>
        {isLoading || createModelEndpointIsLoding ? (
          <LoadingAnimation />
        ) : (
          <section className="relative flex flex-col p-10 pt-[7%] h-full items-start gap-2">
            <h2 className="text-[1.8rem] font-light text-white mb-4">
              Create New Endpoint
            </h2>
            {!showMoreConfig ? (
              <div className="w-[100%] flex justify-between">
                <div className="flex flex-col w-[50%] gap-2">
                  <TextInput
                    name="name"
                    label="Name*"
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                    inputStyles={{ height: 38 }}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : undefined
                    }
                    placeholder="Name of the model"
                  />

                  <SelectInput
                    label="Connection Type*"
                    name="connector_type"
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                    inputStyle={{ height: 38 }}
                    options={connectionTypeOptions}
                    onSyntheticChange={formik.handleChange}
                    value={formik.values.connector_type}
                    placeholder="Select the connector type"
                    style={{ width: '100%' }}
                  />

                  <TextInput
                    name="uri"
                    label="URI"
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                    inputStyles={{ height: 38 }}
                    onChange={formik.handleChange}
                    value={formik.values.uri}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.uri && formik.errors.uri
                        ? formik.errors.uri
                        : undefined
                    }
                    placeholder="URI of the remote model endpoint"
                  />

                  <TextInput
                    name="token"
                    label="Token"
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                    inputStyles={{ height: 38 }}
                    onChange={formik.handleChange}
                    value={formik.values.token}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.token && formik.errors.token
                        ? formik.errors.token
                        : undefined
                    }
                    placeholder="Access token for the remote model endpoint"
                  />
                  <p
                    className="text-[0.95rem] text-white underline cursor-pointer pt-4"
                    onClick={() => setShowMoreConfig(true)}>
                    More Configs
                  </p>
                </div>
                <div className="flex grow gap-2 justify-end items-end">
                  <Button
                    mode={ButtonType.OUTLINE}
                    size="lg"
                    type="button"
                    text="Cancel"
                    onClick={onClose}
                  />
                  <Button
                    mode={ButtonType.PRIMARY}
                    disabled={!submitEnabled}
                    size="lg"
                    type="submit"
                    text="Save"
                    onClick={() => formik.handleSubmit()}
                  />
                </div>
              </div>
            ) : (
              <div className="w-[100%] flex justify-between">
                <div className="flex flex-col w-[50%] gap-2">
                  <SelectInput
                    label="Max Calls Per Second"
                    name="max_calls_per_second"
                    options={maxCallsPerSecondOptions}
                    onSyntheticChange={formik.handleChange}
                    value={formik.values.max_calls_per_second}
                    style={{ width: '100%' }}
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                    inputStyle={{ height: 38 }}
                  />

                  <SelectInput
                    label="Max Concurrency"
                    name="max_concurrency"
                    options={maxConcurrencyOptions}
                    onSyntheticChange={formik.handleChange}
                    value={formik.values.max_concurrency}
                    style={{ width: '100%' }}
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                    inputStyle={{ height: 38 }}
                  />

                  <TextArea
                    label="Other Parameters"
                    name="params"
                    onChange={formik.handleChange}
                    value={formik.values.params}
                    error={
                      formik.touched.params && formik.errors.params
                        ? formik.errors.params
                        : undefined
                    }
                    placeholder="Additional parameters normally in JSON format"
                    labelStyles={{
                      fontSize: '1rem',
                      color: colors.moonpurplelight,
                    }}
                  />
                </div>
                <div className="flex grow gap-2 justify-end items-end">
                  <Button
                    mode={ButtonType.OUTLINE}
                    size="lg"
                    type="button"
                    text="OK"
                    onClick={() => setShowMoreConfig(false)}
                  />
                </div>
              </div>
            )}
          </section>
        )}
      </PopupSurface>
    </div>
  );
}

export { NewEndpointForm };
