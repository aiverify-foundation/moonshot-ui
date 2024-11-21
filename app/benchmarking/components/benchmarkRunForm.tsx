import React from 'react';
import { useFormState } from 'react-dom';
import { createRun } from '@/actions/createRun';
import { getRecipesStatsById } from '@/actions/getRecipesStatsById';
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
  num_of_prompts: '',
  system_prompt: '',
  runner_processing_module: 'benchmarking',
  random_seed: '0',
  run_all: 'false',
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
  const [numOfPromptsInput, setNumOfPromptsInput] = React.useState('');
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [isRunAll, setIsRunAll] = React.useState(false);
  const [recipesStats, setRecipesStats] = React.useState<RecipeStats[]>([]);
  const [formState, formAction] = useFormState<
    FormState<BenchmarkRunFormValues>,
    FormData
  >(createRun, initialFormValues);

  const coercedNumOfPromptsInput = Number(numOfPromptsInput);

  const [numOfPromptsGrandTotal, userInputNumOfPromptsGrandTotal] =
    React.useMemo(() => {
      return recipesStats.reduce(
        (acc, stats) => {
          const totalBasePrompts = Object.values(
            stats.num_of_datasets_prompts
          ).reduce((sum, value) => sum + value, 0);
          const userInputTotalBasePrompts =
            !isNaN(coercedNumOfPromptsInput) &&
            coercedNumOfPromptsInput > 0 &&
            Number.isInteger(coercedNumOfPromptsInput) &&
            !numOfPromptsInput.includes('.')
              ? coercedNumOfPromptsInput * stats.num_of_datasets
              : 0;
          let grandTotalPrompts = totalBasePrompts;
          let userInputGrandTotalPrompts = userInputTotalBasePrompts;
          if (stats.num_of_prompt_templates > 0) {
            grandTotalPrompts =
              grandTotalPrompts * stats.num_of_prompt_templates;
            userInputGrandTotalPrompts =
              userInputGrandTotalPrompts * stats.num_of_prompt_templates;
          }
          return [
            acc[0] + grandTotalPrompts,
            acc[1] + userInputGrandTotalPrompts,
          ];
        },
        [0, 0] as [number, number]
      );
    }, [recipesStats, numOfPromptsInput]);

  React.useEffect(() => {
    if (formState.formStatus === 'error') {
      setShowErrorModal(true);
      return;
    }
  }, [formState]);

  React.useEffect(() => {
    startTransition(() => {
      getRecipesStatsById(
        selectedCookbooks.reduce((allRecipes, cookbook) => {
          allRecipes.push(...cookbook.recipes);
          return allRecipes;
        }, [] as string[])
      ).then((result) => {
        if (result.status === 'error') {
          console.log(result.message);
          setRecipesStats([]);
        } else {
          setRecipesStats(result.data);
        }
      });
    });
  }, [selectedCookbooks]);

  function handleNumOfPromptsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNumOfPromptsInput(e.target.value);
  }

  function handleRunAllChange(isChecked: boolean) {
    setNumOfPromptsInput(isChecked ? '0' : '');
    setIsRunAll(isChecked);
  }

  const disableRunBtn =
    !name ||
    isNaN(coercedNumOfPromptsInput) ||
    (!isRunAll &&
      !isNaN(coercedNumOfPromptsInput) &&
      coercedNumOfPromptsInput < 1) ||
    !Number.isInteger(coercedNumOfPromptsInput) ||
    numOfPromptsInput.includes('.');

  let numOfPromptsError = formState.formErrors?.num_of_prompts?.[0];
  if (
    !isRunAll &&
    numOfPromptsInput.trim() !== '' &&
    coercedNumOfPromptsInput < 1
  ) {
    numOfPromptsError = 'Number of prompts per recipe must be greater than 0';
  } else if (
    !isRunAll &&
    numOfPromptsInput.trim() !== '' &&
    userInputNumOfPromptsGrandTotal > numOfPromptsGrandTotal
  ) {
    numOfPromptsError = `Total number of prompts that will be run should be smaller than actual total number of prompts which is ${numOfPromptsGrandTotal}`;
  } else if (
    !isRunAll &&
    numOfPromptsInput.trim() !== '' &&
    !Number.isInteger(coercedNumOfPromptsInput)
  ) {
    numOfPromptsError = 'Number of prompts per recipe must be an integer';
  }

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
                readOnly
                key={cookbook.id}
                type="hidden"
                name="inputs"
                defaultValue={cookbook.id}
              />
            ))}
            {selectedEndpoints.map((endpoint) => (
              <input
                readOnly
                key={endpoint.id}
                type="hidden"
                name="endpoints"
                defaultValue={endpoint.id}
              />
            ))}
            <input
              readOnly
              type="number"
              name="random_seed"
              defaultValue={initialFormValues.random_seed}
              style={{ display: 'none' }}
            />
            <input
              readOnly
              type="hidden"
              name="runner_processing_module"
              defaultValue={initialFormValues.runner_processing_module}
            />
            <input
              readOnly
              type="hidden"
              name="system_prompt"
              defaultValue={initialFormValues.system_prompt}
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
                        Prompt Templates)
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
                disabled={isRunAll}
                type="number"
                min={1}
                id="num_of_prompts"
                name={isRunAll ? '' : 'num_of_prompts'}
                label="Run a smaller set"
                labelStyles={{
                  fontSize: '1rem',
                  color: colors.moonpurplelight,
                }}
                inputStyles={{ height: 38 }}
                onChange={handleNumOfPromptsChange}
                value={isRunAll ? '' : numOfPromptsInput}
                error={numOfPromptsError}
                placeholder="Number of prompts per recipe. E.g. 5"
                description={
                  <div className="flex flex-col gap-2">
                    <p className="text-moongray-400">
                      Before running the full recommended set, you may want to
                      run a smaller number of prompts from each recipe to do a
                      sanity check.
                    </p>
                    <p style={{ opacity: isRunAll ? 0.5 : 1 }}>
                      Number of prompts that will be run:{' '}
                      {isPending
                        ? 'calculating...'
                        : isRunAll
                          ? numOfPromptsGrandTotal
                          : userInputNumOfPromptsGrandTotal}
                    </p>
                  </div>
                }
                descriptionStyles={{
                  fontSize: '0.9rem',
                  color: colors.white,
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              />
              <div className="flex justify-left gap-2">
                <p className="text-moonpurplelight">
                  Run All{' '}
                  <span
                    className={`${isRunAll ? 'text-white' : 'text-moongray-400'}`}>
                    ({isPending ? 'calculating...' : numOfPromptsGrandTotal}{' '}
                    prompts)
                  </span>
                </p>
                <ToggleSwitch
                  name="run_all"
                  onChange={handleRunAllChange}
                  value={isRunAll ? 'true' : undefined}
                />
              </div>
            </div>

            <RunButton
              disabled={disableRunBtn}
              className="absolute bottom-[8px] right-[18px]"
            />
          </form>
        </div>
      </section>
    </>
  );
}

export default BenchmarkRunForm;
