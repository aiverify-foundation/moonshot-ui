import React from 'react';
import { TextInput } from '@components/textInput';
import { Window } from '@components/window';
import { CheckBox } from '@components/checkbox';
import { TextArea } from '@components/textArea';
import { Formik, Form, FieldArray, FormikHelpers } from 'formik';

type WindowChatStartProps = {
  onCloseClick: () => void;
  onStartClick: (sessionName: string, description: string, llmEndpoints: string[]) => void;
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

const llmEndpoints = [
  {
    id: 'my-openai-gpt35-amin',
    name: 'OpenAI-GPT35',
    description: 'OpenAI GPT-3.5',
  },
  {
    id: 'my-openai-gpt4-amin',
    name: 'OpenAI-GPT4',
    description: 'OpenAI GPT-4',
  },
  {
    id: 'claude2',
    name: 'Claude2',
    description: 'Claude2',
  },
  {
    id: 'llama2',
    name: 'Llama2',
    description: 'Llama2',
  },
];

function WindowCreateSession(props: WindowChatStartProps) {
  const { onCloseClick, onStartClick } = props;

  async function handleFormSubmit(values: FormValues) {
    onStartClick(values.sessionName, values.description, values.llmEndpoints);
  }

  return (
    <Window
      initialXY={[600, 200]}
      name="Start New Session"
      styles={{ width: 600, height: 470, zIndex: 100 }}
      onCloseClick={onCloseClick}>
      <div
        style={{
          color: 'gray',
          padding: 15,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}>
        <Formik<FormValues> initialValues={initialFormValues} onSubmit={handleFormSubmit}>
          {(formProps) => (
            <Form>
              <TextInput
                name="sessionName"
                label="Session Name"
                onChange={formProps.handleChange}
                value={formProps.values.sessionName}
                onBlur={formProps.handleBlur}
                error={
                  formProps.touched.sessionName && formProps.errors.sessionName
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
                  formProps.touched.description && formProps.errors.description
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
                          key={endpoint.id}
                          style={{ marginBottom: 0 }}
                          label={endpoint.name}
                          name={endpoint.id}
                          checked={formProps.values.llmEndpoints.includes(endpoint.id)}
                          onChange={() => {
                            if (formProps.values.llmEndpoints.includes(endpoint.id)) {
                              arrayHelpers.remove(
                                formProps.values.llmEndpoints.indexOf(endpoint.id)
                              );
                            } else {
                              arrayHelpers.push(endpoint.id);
                            }
                          }}
                          value={endpoint.id}
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
                  style={{
                    minWidth: 100,
                    border: '1px solid #cfcfcf',
                    padding: '5px 15px',
                    background: '#1189b9',
                    color: '#FFF',
                    fontSize: 13,
                  }}
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
