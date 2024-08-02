import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useModelsList } from '@/app/hooks/useLLMEndpointList';
import { formatDate } from '@/app/lib/date-utils';
import { SelectListItem } from '@/app/views/shared-components/selectListItem';
import tailwindConfig from '@/tailwind.config';
const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type EndpointSelectViewProps = {
  totalSelected: number;
  selectedModels: LLMEndpoint[];
  onModelClick: (model: LLMEndpoint) => void;
  onEditClick: (model: LLMEndpoint) => void;
  onCreateClick: () => void;
};

function EndpointSelectVew(props: EndpointSelectViewProps) {
  const {
    totalSelected,
    selectedModels,
    onModelClick,
    onEditClick,
    onCreateClick,
  } = props;
  const { models, isLoading } = useModelsList();

  return (
    <div className="flex flex-col pt-4 gap-8 pb-4 h-[80%]">
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-[1.6rem] leading-[2rem] height-[2rem] font-medium tracking-wide text-white w-full text-center">
          {totalSelected > 0 ? (
            <>
              <span
                className="text-[2rem] pr-2"
                style={{ color: colors.moonpurplelight }}>
                {totalSelected}
              </span>
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
          onClick={onCreateClick}
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
            style={{ height: '100%' }}>
            {models.map((model) => {
              const isSelected =
                selectedModels.find((endpoint) => endpoint.id === model.id) !==
                undefined;
              return (
                <SelectListItem<LLMEndpoint>
                  key={model.id}
                  label={model.name}
                  onClick={() => onModelClick(model)}
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
                        onEditClick(model);
                      }}
                    />
                  </div>
                </SelectListItem>
              );
            })}
            <li
              className="flex flex-row gap-2 border border-dashed 
                bg-moongray-950 rounded-xl p-8 items-center cursor-pointer
                mb-[15px] justify-between h-[100px]"
              style={{ flexBasis: '49%' }}
              onClick={onCreateClick}>
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
