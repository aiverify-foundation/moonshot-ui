import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import useModelsList from '@/app/hooks/useLLMEndpointList';
import { BenchmarkNewSessionViews } from '@/app/views/benchmarking/enums';
import {
  addBenchmarkModels,
  removeBenchmarkModels,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import tailwindConfig from '@/tailwind.config';
import { SelectListItem } from './selectListItem';
const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type EndpointSelectViewProps = {
  onModelSelectClick: (model: LLMEndpoint) => void;
  changeView: (view: BenchmarkNewSessionViews) => void;
};

function ModelSelectView(props: EndpointSelectViewProps) {
  const { changeView, onModelSelectClick } = props;
  const { models, error, isLoading, refetch } = useModelsList();
  const dispatch = useAppDispatch();

  const selectedEnpointsForBenchmark = useAppSelector(
    (state) => state.benchmarkModels.entities
  );

  function handleModelClick(model: LLMEndpoint) {
    console.log(model);
    if (
      selectedEnpointsForBenchmark.find((endpoint) => endpoint.id === model.id)
    ) {
      dispatch(removeBenchmarkModels([model]));
    } else {
      dispatch(addBenchmarkModels([model]));
    }
    onModelSelectClick(model);
  }

  return (
    <div className="flex flex-col pt-4 gap-8 pb-4 h-[80%]">
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
          {selectedEnpointsForBenchmark.length > 0 ? (
            <>
              <span
                className="text-[2rem] pr-2"
                style={{ color: colors.moonpurplelight }}>
                {selectedEnpointsForBenchmark.length}
              </span>{' '}
              Endpoint(s) to be tested
            </>
          ) : (
            'Select the Endpoint(s) to be tested'
          )}
        </h2>
        <Button
          size="sm"
          text="Create New Endpoint"
          textSize="1.1rem"
          textWeight="500"
          textColor={colors.white}
          mode={ButtonType.OUTLINE}
          type="button"
          leftIconName={IconName.Plus}
          hoverBtnColor={colors.moongray[800]}
          onClick={() => changeView(BenchmarkNewSessionViews.NEW_ENDPOINT_FORM)}
        />
      </section>
      <div className="relative flex flex-col min-h-[300px] px-[10%] w-[100%] h-full items-center">
        {isLoading ? (
          <div className="ring">
            Loading
            <span />
          </div>
        ) : (
          <ul
            className="flex flex-row flex-wrap gap-[2%] w-[100%] overflow-y-auto custom-scrollbar px-4"
            style={{ height: 'calc(100% - 50px)' }}>
            {models.map((model) => {
              const isSelected =
                selectedEnpointsForBenchmark.find(
                  (endpoint) => endpoint.id === model.id
                ) !== undefined;
              return (
                <SelectListItem<LLMEndpoint>
                  key={model.id}
                  height={80}
                  label={model.name}
                  onClick={handleModelClick}
                  iconName={IconName.OutlineBox}
                  item={model}
                  checked={isSelected}
                  bgColor={isSelected ? colors.moongray[800] : undefined}
                />
              );
            })}
            <li
              className="flex flex-row gap-2 border border-dashed dark:border-moongray-200
                bg-moongray-950 rounded-xl p-8 items-center cursor-pointer
                dark:hover:bg-moongray-900 mb-[15px] justify-between h-[100px]"
              style={{ flexBasis: '49%' }}
              onClick={() =>
                changeView(BenchmarkNewSessionViews.NEW_ENDPOINT_FORM)
              }>
              <div className="flex flex-col w-full">
                <h4 className="text-white text-center text-[1rem]">
                  Testing a new Endpoint?
                </h4>
                <p
                  className="text-center text-[0.8rem]"
                  style={{ color: colors.moonpurplelight }}>
                  Create New Endpoint
                </p>
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export { ModelSelectView };
