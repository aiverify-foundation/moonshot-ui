import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import useModelsList from '@/app/hooks/useLLMEndpointList';
import { formatDate } from '@/app/lib/date-utils';
import { BenchmarkNewSessionViews } from '@/app/views/benchmarking/enums';
import { SelectListItem } from '@/app/views/shared-components/selectListItem';
import {
  addBenchmarkModels,
  removeBenchmarkModels,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import tailwindConfig from '@/tailwind.config';
const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type EndpointSelectViewProps = {
  onModelSelectClick: (model: LLMEndpoint) => void;
  changeView: (view: BenchmarkNewSessionViews, data?: LLMEndpoint) => void;
};

function EndpointSelectVew(props: EndpointSelectViewProps) {
  const { changeView, onModelSelectClick } = props;
  const { models, isLoading } = useModelsList();
  const dispatch = useAppDispatch();

  const selectedEnpointsForBenchmark = useAppSelector(
    (state) => state.benchmarkModels.entities
  );

  function handleModelClick(model: LLMEndpoint) {
    if (
      selectedEnpointsForBenchmark.find((endpoint) => endpoint.id === model.id)
    ) {
      dispatch(removeBenchmarkModels([model]));
    } else {
      dispatch(addBenchmarkModels([model]));
    }
    onModelSelectClick(model);
  }

  function handleEditEndpointClick(model: LLMEndpoint) {
    changeView(BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM, model);
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
                  label={model.name}
                  onClick={handleModelClick}
                  iconName={IconName.OutlineBox}
                  item={model}
                  checked={isSelected}
                  bgColor={isSelected ? colors.moongray[800] : undefined}>
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-[0.8rem] text-moongray-400">
                      Added on {formatDate(model.created_date)}
                    </p>
                    <Button
                      text="Edit"
                      width={70}
                      mode={ButtonType.OUTLINE}
                      size="sm"
                      leftIconName={IconName.Pencil}
                      iconSize={16}
                      textColor={colors.white}
                      hoverBtnColor={colors.moongray[950]}
                      pressedBtnColor={colors.moongray[900]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEndpointClick(model);
                      }}
                    />
                  </div>
                </SelectListItem>
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

export { EndpointSelectVew };
