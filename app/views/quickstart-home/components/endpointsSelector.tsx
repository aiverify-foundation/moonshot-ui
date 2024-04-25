import { IconName } from '@/app/components/IconSVG';
import useModelsList from '@/app/hooks/useLLMEndpointList';
import { SelectListItem } from './selectListItem';

type EndpointSelectViewProps = {
  onModelSelectClick: (model: LLMEndpoint) => void;
};

function ModelSelectView(props: EndpointSelectViewProps) {
  const { onModelSelectClick } = props;
  const { models, error, isLoading, refetch } = useModelsList();

  function handleModelClick(model: LLMEndpoint) {
    console.log(model);
    onModelSelectClick(model);
  }

  function handleCreateNewEndpoint() {
    console.log('New Endpoint');
  }

  return (
    <div className="flex flex-col pt-4 gap-10 pb-10 max-h-[350px]">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
        Select the Endpoint(s) to be tested
      </h2>

      <div className="relative flex flex-row min-h-[300px] px-[10%] w-[100%] h-full">
        {isLoading ? (
          <div className="ring">
            Loading
            <span />
          </div>
        ) : (
          <ul className="flex flex-row flex-wrap gap-[2%] w-[100%] h-[250px] overflow-y-auto custom-scrollbar px-4">
            {models.map((model) => (
              <SelectListItem<LLMEndpoint>
                key={model.id}
                height={80}
                label={model.name}
                onClick={handleModelClick}
                iconName={IconName.OutlineBox}
                item={model}
              />
            ))}
            <li
              className="flex flex-row gap-2 border border-dashed dark:border-moongray-200
                bg-moongray-950 rounded-xl p-8 items-center cursor-pointer
                dark:hover:bg-moongray-900 mb-[15px] justify-between h-[100px]"
              style={{ flexBasis: '49%' }}
              onClick={handleCreateNewEndpoint}>
              <div className="flex flex-col w-full">
                <h4 className="text-white text-center text-[1rem]">
                  Testing a new Endpoint?
                </h4>
                <p className="text-center text-logocolor text-[0.8rem]">
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
