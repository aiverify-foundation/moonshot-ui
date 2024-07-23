'use client';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { object, string, number, boolean } from 'yup';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { toErrorWithMessage } from '@/app/lib/error-utils';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';
import {
  useCreateLLMEndpointMutation,
  useUpdateLLMEndpointMutation,
} from '@/app/services/llm-endpoint-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Modal } from '@/app/views/shared-components/modal/modal';
import { PopupSurface } from '@/app/views/shared-components/popupSurface/popupSurface';

const initialFormValues: LLMEndpointFormValues = {
  connector_type: '',
  name: '',
  uri: '',
  token: '',
  max_calls_per_second: '10',
  max_concurrency: '1',
  params: `{
      "timeout": 300,
      "allow_retries": true,
      "num_of_retries": 3,
      "temperature": 0.5,
      "model": ""
  }`,
};

const paramsSchema = object().shape({
  timeout: number().positive('Timeout must be a positive number'),
  allow_retries: boolean(),
  num_of_retries: number(),
  temperature: number(),
  model: string().required('Parameter "Model" is required'),
});

const validationSchema = object().shape({
  name: string().required('Name is required'),
  token: string()
    .min(1, 'Token is required')
    .matches(/\S/, 'Token cannot be empty spaces')
    .required('Token is required'),
  connector_type: string().required('Connector Type is required'),
  max_calls_per_second: string().required('Max calls Per Second is required'),
  max_concurrency: string().required('Max Concurrency is required'),
  params: string()
    .min(1, 'Other Parameters is required')
    .required('Other Parameters is required'),
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
  endpointToEdit?: LLMEndpoint;
  disablePopupLayout?: boolean;
  onClose?: () => void;
};

enum TokenInputMode {
  EDITING = 'editing',
  DEFAULT = 'default',
}

function NewEndpointForm(props: NewEndpointFormProps) {
  const router = useRouter();
  const isFirstRender = useRef(true);
  const { onClose, disablePopupLayout, endpointToEdit } = props;
  const [showMoreConfig, setShowMoreConfig] = useState(false);
  const [isMaskTypedToken, setIsMaskTypedToken] = useState(true);
  const [tokenInputMode, setTokenInputMode] = useState<TokenInputMode>(
    () => TokenInputMode.DEFAULT
  );
  const [alertMessage, setAlertMessage] = useState<AlertMsg | undefined>();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);

  const [createModelEndpoint, { isLoading: createModelEndpointIsLoding }] =
    useCreateLLMEndpointMutation();

  const [updateModelEndpoint, { isLoading: updateModelEndpointIsLoding }] =
    useUpdateLLMEndpointMutation();

  const [connectionTypeOptions, setConnectionTypeOptions] = useState<
    SelectOption[]
  >([]);
  const { data, isLoading } = useGetAllConnectorsQuery();

  let editModeFormValues: LLMEndpointFormValues = initialFormValues;
  try {
    editModeFormValues = endpointToEdit
      ? {
          connector_type: endpointToEdit.connector_type,
          name: endpointToEdit.name,
          uri: endpointToEdit.uri,
          token: endpointToEdit.token,
          max_calls_per_second: endpointToEdit.max_calls_per_second.toString(),
          max_concurrency: endpointToEdit.max_concurrency.toString(),
          params: JSON.stringify(endpointToEdit.params, null, 2),
        }
      : initialFormValues;
  } catch (error) {
    const errWithMsg = toErrorWithMessage(error);
    setAlertMessage({
      heading: 'Error',
      iconName: IconName.Alert,
      iconColor: 'red',
      message: errWithMsg.message,
    });
  }

  const formik = useFormik({
    initialValues: endpointToEdit ? editModeFormValues : initialFormValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (endpointToEdit) {
        if (values.token !== undefined && values.token.length === 0) {
          delete values.token; // do not send empty string token. can just patch other values to update at server-end
        }
        if (
          values.token !== undefined &&
          values.token.trim() === endpointToEdit.token
        ) {
          delete values.token; // do not send token if user did not update token value. just patch other values to update at server-end
        }
        await updateModelEndpoint({
          id: endpointToEdit.id,
          endpointDetails: values,
        });
      } else {
        await submitNewEndpoint(values);
      }
      if (disablePopupLayout) {
        router.push('/endpoints');
        router.refresh();
      } else if (onClose) {
        onClose();
      }
    },
  });

  useEffect(() => {
    if (data) {
      const options: SelectOption[] = data.map((connector) => ({
        value: connector,
        label: connector,
      }));
      setConnectionTypeOptions(options);
    }
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDisableSaveBtn(!formik.isValid);
    }, 300);
    return () => clearTimeout(handler);
  }, [formik.isValid, endpointToEdit]);

  useEffect(() => {
    if (!endpointToEdit || isFirstRender.current) return;
    if (formik.dirty) {
      setDisableSaveBtn(!formik.isValid);
    } else {
      setDisableSaveBtn(true);
    }
  }, [formik.dirty, endpointToEdit]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  const hasEmptyFields =
    formik.values.name.trim() === '' ||
    formik.values.connector_type.trim() === '' ||
    formik.values.params?.trim() === '' ||
    formik.values.token?.trim() === '';

  function handleTokenInputFocus(_: React.FocusEvent<HTMLInputElement>) {
    setTokenInputMode(TokenInputMode.EDITING);
    // note - backend api returns empty string if token is not set; it returns string of asterisks masking the token if token exists
    if (tokenInputMode === TokenInputMode.DEFAULT) {
      // not editing the input, cursor is outside
      if (endpointToEdit) {
        // if EDITING AN ENDPOINT
        if (formik.values.token === endpointToEdit.token) {
          formik.setFieldValue('token', '');
          setIsMaskTypedToken(false); // display masked text
          return;
        }
        if (
          formik.values.token &&
          formik.values.token.trim() !== endpointToEdit.token &&
          formik.values.token.length > 0
        ) {
          // user has typed in an updated token string
          setIsMaskTypedToken(false); // display clear text
          return;
        }
        // user has not typed in anything
        setIsMaskTypedToken(true); // display masked text
      }
      // if CREATING A NEW ENDPOINT
      setIsMaskTypedToken(false); // creating a new endpoint, just display clear text
      return;
    }

    if (tokenInputMode === TokenInputMode.EDITING) {
      // if editing the input, cursor is inside (focused)
      setIsMaskTypedToken(false); // display clear text regardless if new endpoint or editing existing endpoint
    }
  }

  function handleTokenInputBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (formik.values.token && formik.values.token.trim() === '') {
      if (endpointToEdit) {
        formik.setFieldValue('token', endpointToEdit.token);
      }
      setTokenInputMode(TokenInputMode.DEFAULT);
      formik.handleBlur(e);
      return;
    }

    setIsMaskTypedToken(true);
    setTokenInputMode(TokenInputMode.DEFAULT);
    formik.handleBlur(e);
  }

  function handleConfigOkClick() {
    if (formik.values.params) {
      if (validateParams(formik.values.params)) {
        setShowMoreConfig(false);
      }
    }
  }

  function handleParamsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    formik.setFieldValue('params', e.target.value);
  }

  function validateParams(value: string): boolean {
    try {
      const parsed = JSON.parse(value);
      paramsSchema.validateSync(parsed, { strict: true });
      formik.setFieldValue('params', value);
      return true;
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      formik.setErrors({ params: errorWithMessage.message });
      return false;
    }
  }

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
      const errWithMsg = toErrorWithMessage(response.error);
      setAlertMessage({
        heading: 'Error',
        iconName: IconName.Alert,
        iconColor: 'red',
        message: errWithMsg.message,
      });
      return;
    }
  }

  const formSection = (
    <>
      <h2 className="text-[1.8rem] font-light text-white mb-4">
        {endpointToEdit
          ? `Update ${endpointToEdit.name}`
          : 'Create New Endpoint'}
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
              error={
                formik.touched.connector_type && formik.errors.connector_type
                  ? formik.errors.connector_type
                  : undefined
              }
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
              inputStyles={
                {
                  height: 38,
                  ...(isMaskTypedToken && {
                    WebkitTextSecurity: 'disc',
                    textSecurity: 'disc',
                  }),
                } as React.CSSProperties
              }
              onChange={formik.handleChange}
              value={(() => {
                // note - backend api returns empty string if token is not set; it returns string of asterisks masking the token if token exists
                if (tokenInputMode === TokenInputMode.DEFAULT) {
                  // not editing the input, cursor is outside
                  if (endpointToEdit) {
                    // if EDITING AN ENDPOINT
                    if (
                      formik.values.token !== undefined &&
                      formik.values.token.trim() !== '' &&
                      formik.values.token.length > 0
                    ) {
                      // user has typed in an updated token string, populate with user input
                      return formik.values.token;
                    }
                    if (endpointToEdit.token.length > 0) {
                      formik.setFieldValue('token', endpointToEdit.token);
                      return endpointToEdit.token; // display the masked string if there is token
                    }
                    return ''; // populate with empty string if no token
                  }
                  // if CREATING A NEW ENDPOINT
                  return formik.values.token; // populate with user input (what user has entered)
                }
                if (tokenInputMode === TokenInputMode.EDITING) {
                  // if editing the input, cursor is inside (focused)
                  if (endpointToEdit) {
                    // if EDITING AN ENDPOINT
                    return formik.values.token; // populate with user input (what user has entered)
                  }
                  return formik.values.token; // populate with user input (what user has entered)
                }
              })()}
              onBlur={handleTokenInputBlur}
              onFocus={handleTokenInputFocus}
              error={
                formik.touched.token && formik.errors.token
                  ? formik.errors.token
                  : undefined
              }
              placeholder="Access token for the remote model endpoint"
            />
            <p
              className="text-[0.95rem] text-white underline cursor-pointer pt-4"
              style={{ width: 'fit-content' }}
              onClick={() => setShowMoreConfig(true)}>
              More Configs
            </p>
          </div>
          <div className="flex grow gap-4 justify-end items-end">
            <Button
              width={120}
              mode={ButtonType.OUTLINE}
              size="lg"
              type="button"
              text="Cancel"
              onClick={disablePopupLayout ? () => router.back() : onClose}
              hoverBtnColor={colors.moongray[800]}
              pressedBtnColor={colors.moongray[700]}
            />
            <Button
              width={120}
              disabled={hasEmptyFields || disableSaveBtn}
              mode={ButtonType.PRIMARY}
              size="lg"
              type="submit"
              text="Save"
              onClick={() => formik.handleSubmit()}
              hoverBtnColor={colors.moongray[1000]}
              pressedBtnColor={colors.moongray[900]}
            />
          </div>
        </div>
      ) : (
        <div className="w-[100%] flex justify-between">
          <div className="flex flex-col w-[50%] gap-2">
            <SelectInput
              id="max_calls_per_second"
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
              id="max_concurrency"
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
              onChange={handleParamsChange}
              value={formik.values.params}
              error={formik.errors.params ? formik.errors.params : undefined}
              placeholder="Additional parameters normally in JSON format"
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              inputStyles={{ height: 200 }}
            />
          </div>
          <div className="flex grow gap-2 justify-end items-end">
            <Button
              disabled={!formik.values.params}
              width={120}
              mode={ButtonType.OUTLINE}
              size="lg"
              type="button"
              text="OK"
              onClick={handleConfigOkClick}
              hoverBtnColor={colors.moongray[800]}
              pressedBtnColor={colors.moongray[700]}
            />
          </div>
        </div>
      )}
    </>
  );

  if (disablePopupLayout) {
    return (
      <MainSectionSurface
        closeLinkUrl="/endpoints"
        height="100%"
        minHeight={750}
        bgColor={colors.moongray['950']}>
        {createModelEndpointIsLoding || updateModelEndpointIsLoding ? (
          <div className="relative w-full h-full">
            <LoadingAnimation />
          </div>
        ) : (
          <div className="relative w-full h-full px-6">{formSection}</div>
        )}
      </MainSectionSurface>
    );
  }

  return (
    <>
      {alertMessage && (
        <Modal
          heading={alertMessage.heading}
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Ok"
          enableScreenOverlay
          onCloseIconClick={() => setAlertMessage(undefined)}
          onPrimaryBtnClick={() => setAlertMessage(undefined)}>
          <div className="flex gap-2">
            <Icon
              name={alertMessage.iconName}
              size={24}
              color={alertMessage.iconColor}
            />
            <p className="text-[0.9rem] pt-3">{alertMessage.message}</p>
          </div>
        </Modal>
      )}
      <div className="flex flex-col pt-4 w-full h-full">
        <PopupSurface
          height="100%"
          onCloseIconClick={onClose}>
          {isLoading || createModelEndpointIsLoding ? (
            <LoadingAnimation />
          ) : (
            <section className="relative flex flex-col p-10 pt-[7%] h-full items-start gap-2">
              {formSection}
            </section>
          )}
        </PopupSurface>
      </div>
    </>
  );
}

export { NewEndpointForm };
