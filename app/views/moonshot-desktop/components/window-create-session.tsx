import { Formik, Form, FieldArray } from 'formik';
import React from 'react';
import useLLMEndpointList from '@/app/views/moonshot-desktop/hooks/useLLMEndpointList';
import { CheckBox } from '@components/checkbox';
import { TextArea } from '@components/textArea';
import { TextInput } from '@components/textInput';
import { Window } from '@components/window';

type WindowChatStartProps = {
  onCloseClick: () => void;
  onStartClick: (
    sessionName: string,
    description: string,
    llmEndpoints: string[]
  ) => void;
};

type FormValues = {
  sessionName: string;
  description: string;
  llmEndpoints: string[];
};

const initialFormValues: FormValues = {
  sessionName: '',
  description: '',
  llmEndpoints: [],
};

function WindowCreateSession(props: WindowChatStartProps) {
  const { onCloseClick, onStartClick } = props;
  const { llmEndpoints, error, isLoading } = useLLMEndpointList();

  async function handleFormSubmit(values: FormValues) {
    onStartClick(
      values.sessionName,
      values.description,
      values.llmEndpoints
    );
  }

  return (
    <Window
      id="create-session"
      resizeable={false}
      draggable={false}
      initialXY={[600, 200]}
      initialWindowSize={[600, 470]}
      name="Start New Session"
      styles={{ zIndex: 100 }}
      onCloseClick={onCloseClick}>
      <div
        style={{
          color: 'gray',
          padding: 15,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}>
        <Formik<FormValues>
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}>
          {(formProps) => (
            <Form>
              <TextInput
                name="sessionName"
                label="Session Name"
                onChange={formProps.handleChange}
                value={formProps.values.sessionName}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.sessionName &&
                  formProps.errors.sessionName
                    ? formProps.errors.sessionName
                    : undefined
                }
                placeholder="Give an identifier name to this session"
              />
              <TextArea
                name="description"
                label="Description"
                onChange={formProps.handleChange}
                error={
                  formProps.touched.description &&
                  formProps.errors.description
                    ? formProps.errors.description
                    : undefined
                }
                value={formProps.values.description}
                placeholder="Give a description of this session"
              />
              <div
                style={{
                  color: '#676767',
                  fontWeight: 600,
                  marginBottom: 4,
                  fontSize: 13,
                }}>
                LLM Endpoints
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid lightgray',
                  padding: 15,
                  borderRadius: 5,
                  position: 'relative',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: 15,
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: 20,
                  }}>
                  <FieldArray
                    name="llmEndpoints"
                    render={(arrayHelpers) =>
                      llmEndpoints.map((endpoint) => (
                        <CheckBox
                          key={endpoint.name}
                          style={{ marginBottom: 0 }}
                          label={endpoint.name}
                          name={endpoint.name}
                          checked={formProps.values.llmEndpoints.includes(
                            endpoint.name
                          )}
                          onChange={() => {
                            if (
                              formProps.values.llmEndpoints.includes(
                                endpoint.name
                              )
                            ) {
                              arrayHelpers.remove(
                                formProps.values.llmEndpoints.indexOf(
                                  endpoint.name
                                )
                              );
                            } else {
                              arrayHelpers.push(endpoint.name);
                            }
                          }}
                          value={endpoint.name}
                        />
                      ))
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  width: 'calc(100% - 30px)',
                  position: 'absolute',
                  bottom: 10,
                  textAlign: 'right',
                }}>
                <button
                  className="btn-primary"
                  type="submit">
                  Start
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Window>
  );
}

export { WindowCreateSession };
