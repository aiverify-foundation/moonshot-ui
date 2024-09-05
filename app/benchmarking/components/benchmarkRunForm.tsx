import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { object, string, number, array } from 'yup';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/customColors';
import { useRunBenchmarkMutation } from '@/app/services/benchmark-api-service';
import { BenchmarkCollectionType } from '@/app/types/enums';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import ToggleSwitch from '@/app/components/toggleSwitch';

const initialFormValues: BenchmarkRunFormValues = {
  run_name: '',
  description: '',
  inputs: [],
  endpoints: [],
  num_of_prompts: '0',
  system_prompt: '',
  runner_processing_module: 'benchmarking',
  random_seed: '0',
};

const validationSchema = object().shape({
  run_name: string().required('Name is required'),
  description: string(),
  num_of_prompts: number()
    .required('Number of Prompts is required')
    .typeError('Number of Prompts must be a number')
    .min(0, 'Number of Prompts cannot be a negative number'),
  inputs: array().min(1, 'At least one cookbook is required'),
  endpoints: array().min(1, 'At least one endpoint is required'),
});

type BenchmarkRunFormProps = {
  selectedCookbooks: Cookbook[];
  selectedEndpoints: LLMEndpoint[];
};

function BenchmarkRunForm({
  selectedCookbooks,
  selectedEndpoints,
}: BenchmarkRunFormProps) {
  const [disableRunBtn, setDisableRunBtn] = React.useState(false);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setDisableRunBtn(true);
      createBenchmarkRun(values);
      dispatch(resetBenchmarkCookbooks());
      dispatch(resetBenchmarkModels());
    },
  });
  const [runBenchmark, { isLoading }] = useRunBenchmarkMutation();
  const router = useRouter();

  async function createBenchmarkRun(data: BenchmarkRunFormValues) {
    const response = await runBenchmark({
      benchmarkRunInputData: data,
      collectionType: BenchmarkCollectionType.COOKBOOK,
    });
    if ('error' in response) {
      // TODO - show error modal
      setDisableRunBtn(false);
      return;
    }
    router.push(`/benchmarking/session/run?runner_id=${response.data.id}`);
  }

  useEffect(() => {
    formik.setFieldValue(
      'inputs',
      selectedCookbooks.map((cb) => cb.id)
    );
  }, [selectedCookbooks]);

  useEffect(() => {
    formik.setFieldValue(
      'endpoints',
      selectedEndpoints.map((ep) => ep.id)
    );
  }, [selectedEndpoints]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[300px] gap-5">
      <div className="flex flex-col w-[50%] gap-2">
        <TextInput
          id="run_name"
          name="run_name"
          label="Name"
          onChange={formik.handleChange}
          value={formik.values.run_name}
          onBlur={formik.handleBlur}
          error={
            formik.touched.run_name && formik.errors.run_name
              ? formik.errors.run_name
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
          id="description"
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
            onChange={formik.handleChange}
            value={formik.values.num_of_prompts}
            onBlur={formik.handleBlur}
            error={
              formik.touched.num_of_prompts && formik.errors.num_of_prompts
                ? formik.errors.num_of_prompts
                : undefined
            }
            placeholder="Number of prompts perrecipe. E.g., 5"
            description={
              <div className="flex flex-col gap-2">
                <p className="text-moongray-400">
                  Before running the full recommended set, you may want to run a
                  smaller number of prompts from each recipe to do a sanity
                  check.
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
          <Button
            disabled={disableRunBtn || isLoading || !formik.isValid}
            mode={ButtonType.PRIMARY}
            size="lg"
            type="button"
            text="Run"
            onClick={() => formik.handleSubmit()}
            hoverBtnColor={colors.moongray[950]}
            pressedBtnColor={colors.moongray[900]}
          />
        </div>
      </div>
    </section>
  );
}

export default BenchmarkRunForm;
