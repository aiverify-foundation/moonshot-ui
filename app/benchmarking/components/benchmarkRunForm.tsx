import React from 'react';
import { useFormState } from 'react-dom';
import { createRun } from '@/actions/createRun';
import { getRecipesStatsById } from '@/actions/getRecipesStatsById';
import { Icon, IconName } from '@/app/components/IconSVG';
import { FormStateErrorList } from '@/app/components/formStateErrorList';
import { Modal } from '@/app/components/modal';
import { Slider } from '@/app/components/slider/Slider';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import ToggleSwitch from '@/app/components/toggleSwitch';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import { RunButton } from './runButton';

const MemoizedToggleSwitch = React.memo(ToggleSwitch);

const initialFormValues: FormState<BenchmarkRunFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  run_name: '',
  description: '',
  inputs: [],
  endpoints: [],
  prompt_selection_percentage: '1',
  system_prompt: '',
  runner_processing_module: 'benchmarking',
  random_seed: '0',
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
  const [percentageOfPrompts, setPercentageOfPrompts] = React.useState(1);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [isRunAll, setIsRunAll] = React.useState(false);
  const [recipesStats, setRecipesStats] = React.useState<RecipeStats[]>([]);
  const [formState, formAction] = useFormState<
    FormState<BenchmarkRunFormValues>,
    FormData
  >(createRun, initialFormValues);

  const decimalFraction = percentageOfPrompts / 100;
  const calcPercentageAtEachDataset = true; // if true, percentage is applied to each dataset instead of applying to total prompts from all datasets
  const [numOfPromptsGrandTotal, userInputNumOfPromptsGrandTotal] =
    React.useMemo(() => {
      return recipesStats.reduce(
        (acc, stats) => {
          let percentageCalculatedTotalPrompts = 0;
          const totalPromptsFromAllDatasets = Object.values(
            stats.num_of_datasets_prompts
          ).reduce((sum, value) => {
            if (calcPercentageAtEachDataset) {
              percentageCalculatedTotalPrompts += Math.max(1, Math.floor(
                value * decimalFraction
              ));
            }
            return sum + value;
          }, 0);
          const grandTotalPromptsToRun =
            stats.num_of_prompt_templates > 0
              ? totalPromptsFromAllDatasets * stats.num_of_prompt_templates
              : totalPromptsFromAllDatasets;
          let userInputTotalPromptsToRun = 0;
          if (stats.num_of_prompt_templates > 0) {
            if (calcPercentageAtEachDataset) {
              userInputTotalPromptsToRun =
                percentageCalculatedTotalPrompts *
                stats.num_of_prompt_templates;
            } else {
              userInputTotalPromptsToRun =
                decimalFraction *
                grandTotalPromptsToRun *
                stats.num_of_prompt_templates;
            }
          } else {
            if (calcPercentageAtEachDataset) {
              userInputTotalPromptsToRun = percentageCalculatedTotalPrompts;
            } else {
              userInputTotalPromptsToRun =
                decimalFraction * grandTotalPromptsToRun;
            }
          }
          return [
            acc[0] + grandTotalPromptsToRun,
            acc[1] + userInputTotalPromptsToRun,
          ];
        },
        [0, 0] as [number, number]
      );
    }, [recipesStats, percentageOfPrompts]);

  const roundedUserInputNumOfPromptsGrandTotal = Math.max(
    1,
    Math.floor(userInputNumOfPromptsGrandTotal)
  );

  const prevPercentageValue = React.useRef(percentageOfPrompts);

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

  function handleSliderMouseUp(value: number) {
    if (value === 100) return;
    prevPercentageValue.current = value;
  }

  const handleSliderValueChange = (value: number) => {
    setPercentageOfPrompts(value);
    if (value === 100) {
      setIsRunAll(true);
    } else {
      setIsRunAll(false);
    }
  };

  const handleRunAllChange = React.useCallback((isChecked: boolean) => {
    const prevValue =
      prevPercentageValue.current !== 100 ? prevPercentageValue.current : 1;
    setPercentageOfPrompts(isChecked ? 100 : prevValue);
    setIsRunAll(isChecked);
  }, []);

  const disableRunBtn = !name;

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
        <div className="flex flex-col w-[55%] ipad11Inch:w-[60%] ipadPro:w-[65%] gap-2">
          <form
            action={formAction}
            className="ipad11Inch:h-[calc(300px)] ipadPro:h-[calc(300px)] overflow-y-auto custom-scrollbar ipad11Inch:p-6 ipadPro:p-6 px-6">
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
              <div className="w-full flex flex-col">
                <div className="absolute top-[2px] left-[140px]">
                  <Tooltip
                    position={TooltipPosition.right}
                    offsetLeft={10}
                    content={
                      <div>
                        <p>
                          Before running the full set of prompts, you may want
                          to run a smaller set as a sanity check.
                        </p>
                      </div>
                    }>
                    <Icon
                      name={IconName.Alert}
                      color={colors.moonpurplelight}
                    />
                  </Tooltip>
                </div>
                <Slider.Label className="!text-moonpurplelight">
                  Run a smaller set
                </Slider.Label>
                <p className="text-moongray-400">
                  Select the percentage of prompts you want to run from the
                  cookbook(s) selected.
                </p>
                <Slider
                  min={1}
                  max={100}
                  initialValue={isRunAll ? 100 : percentageOfPrompts}
                  className="mt-[45px] mb-[10px]"
                  valueSuffix="%"
                  onChange={handleSliderValueChange}
                  onMouseUp={handleSliderMouseUp}>
                  <Slider.Track />
                  <Slider.ProgressTrack />
                  <Slider.Handle>
                    <div className="absolute left-[50%] top-[-220%] transform -translate-x-1/2">
                      <Slider.Value />
                    </div>
                  </Slider.Handle>
                  <Slider.Input
                    name="prompt_selection_percentage"
                    style={{ display: 'none' }}
                  />
                </Slider>
                <p
                  className={`text-white text-[0.9rem] mb-[10px]
                  ${isRunAll ? 'opacity-50' : 'opacity-100'}`}>
                  Number of prompts that will be run:{' '}
                  {isPending
                    ? 'calculating...'
                    : isRunAll
                      ? numOfPromptsGrandTotal
                      : roundedUserInputNumOfPromptsGrandTotal}
                </p>
              </div>
              <div className="flex justify-left gap-2 mb-8">
                <p className="text-moonpurplelight">
                  Run All{' '}
                  <span
                    className={`${isRunAll ? 'text-white' : 'text-moongray-400'}`}>
                    ({isPending ? 'calculating...' : numOfPromptsGrandTotal}{' '}
                    prompts)
                  </span>
                </p>
                <MemoizedToggleSwitch
                  name="run_all"
                  onChange={handleRunAllChange}
                  value={isRunAll ? 'true' : undefined}
                  defaultChecked={percentageOfPrompts === 100}
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
