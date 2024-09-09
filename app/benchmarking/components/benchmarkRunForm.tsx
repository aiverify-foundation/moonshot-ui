import React from 'react';
import { useFormState } from 'react-dom';
import { createRun } from '@/actions/createRun';
import { Icon, IconName } from '@/app/components/IconSVG';
import { FormStateErrorList } from '@/app/components/formStateErrorList';
import { Modal } from '@/app/components/modal';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import ToggleSwitch from '@/app/components/toggleSwitch';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import { RunButton } from './runButton';

const initialFormValues: FormState<BenchmarkRunFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  run_name: '',
  description: '',
  inputs: [],
  endpoints: [],
  num_of_prompts: 1,
  system_prompt: '',
  runner_processing_module: 'benchmarking',
  random_seed: 0,
};

type BenchmarkRunFormProps = {
  selectedCookbooks: Cookbook[];
  selectedEndpoints: LLMEndpoint[];
};

function BenchmarkRunForm({
  selectedCookbooks,
  selectedEndpoints,
}: BenchmarkRunFormProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [numOfPrompts, setNumOfPrompts] = React.useState('');
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const [formState, formAction] = useFormState<
    FormState<BenchmarkRunFormValues>,
    FormData
  >(createRun, initialFormValues);

  React.useEffect(() => {
    if (formState.formStatus === 'error') {
      setShowErrorModal(true);
      return;
    }
  }, [formState]);

  const disableRunBtn = !name || !numOfPrompts;

  return (
    <>
      {showErrorModal && (
        <Modal
          heading={
            <div className="flex items-center justify-center gap-2">
              <Icon
                name={IconName.Alert}
                size={30}
                color="red"
              />
              <div className="text-lg">Errors</div>
            </div>
          }
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Close"
          enableScreenOverlay
          onCloseIconClick={() => setShowErrorModal(false)}
          onPrimaryBtnClick={() => setShowErrorModal(false)}>
          <div className="flex flex-col gap-2 items-start">
            {formState.formErrors && (
              <FormStateErrorList formErrors={formState.formErrors} />
            )}
          </div>
        </Modal>
      )}
      <section className="flex flex-col items-center justify-center min-h-[300px] gap-5">
        <div className="flex flex-col w-[50%] gap-2">
          <form action={formAction}>
            {selectedCookbooks.map((cookbook) => (
              <input
                key={cookbook.id}
                type="hidden"
                name="inputs"
                value={cookbook.id}
              />
            ))}
            {selectedEndpoints.map((endpoint) => (
              <input
                key={endpoint.id}
                type="hidden"
                name="endpoints"
                value={endpoint.id}
              />
            ))}
            <input
              type="hidden"
              name="random_seed"
              value={initialFormValues.random_seed}
            />
            <input
              type="hidden"
              name="runner_processing_module"
              value={initialFormValues.runner_processing_module}
            />
            <input
              type="hidden"
              name="system_prompt"
              value={initialFormValues.system_prompt}
            />
            <TextInput
              id="run_name"
              name="run_name"
              label="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              error={formState.formErrors?.run_name?.[0]}
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              inputStyles={{ height: 38 }}
              placeholder="Give this session a unique name"
            />

            <TextArea
              id="description"
              name="description"
              label="Description (optional)"
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              error={formState.formErrors?.description?.[0]}
              placeholder="Description of this benchmark run"
            />

            <div className="relative flex flex-col">
              <div className="absolute top-[2px] left-[140px]">
                <Tooltip
                  position={TooltipPosition.right}
                  offsetLeft={10}
                  content={
                    <div>
                      <h4 className="font-bold">How is it calculated</h4>
                      <p>
                        Total Prompts = (Prompt indicated x Number of Datasets x
                        metrics x Prompt Templates)
                      </p>
                    </div>
                  }>
                  <Icon
                    name={IconName.Alert}
                    color={colors.moonpurplelight}
                  />
                </Tooltip>
              </div>
              <TextInput
                id="num_of_prompts"
                name="num_of_prompts"
                label="Run a smaller set"
                labelStyles={{
                  fontSize: '1rem',
                  color: colors.moonpurplelight,
                }}
                inputStyles={{ height: 38 }}
                onChange={(e) => setNumOfPrompts(e.target.value)}
                value={numOfPrompts}
                error={formState.formErrors?.num_of_prompts?.[0]}
                placeholder="Number of prompts per recipe. E.g. 5"
                description={
                  <div className="flex flex-col gap-2">
                    <p className="text-moongray-400">
                      Before running the full recommended set, you may want to
                      run a smaller number of prompts from each recipe to do a
                      sanity check.
                    </p>
                    <p>Number of prompts that will be run:</p>
                  </div>
                }
                descriptionStyles={{
                  fontSize: '0.9rem',
                  color: colors.white,
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              />
              <div className="flex justify-between">
                <p className="text-moonpurplelight">
                  Run All{' '}
                  <span className="text-moongray-400">(xxxxxx prompts)</span>
                </p>
                <ToggleSwitch />
              </div>
            </div>

            <div className="flex grow gap-2 justify-center items-end mt-3">
              <RunButton disabled={disableRunBtn} />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default BenchmarkRunForm;
