import { IconName } from '@/app/components/IconSVG';
import useModelsList from '@/app/hooks/useLLMEndpointList';
import { SelectListItem } from './selectListItem';

type EndpointSelectViewProps = {
  onSelect: (model: LLMEndpoint) => void;
};

function ModelSelectView() {
  const { models, error, isLoading, refetch } = useModelsList();

  function handleModelClick(model: LLMEndpoint) {
    console.log(model);
  }

  function handleCreateNewEndpoint() {
    console.log('New Endpoint');
  }

  return (
    <div className="flex flex-col pt-4 gap-10 pb-10">
      <h2 className="text-[2rem] font-medium tracking-wide text-white w-full text-center">
        Select the Endpoint(s) to be tested
      </h2>

      <div className="flex flex-col min-h-[400px] px-[10%] w-[100%]">
        {isLoading ? (
          <div className="ring">
            Loading
            <span />
          </div>
        ) : (
          <ul className="flex flex-row flex-wrap gap-[2%] w-[100%]">
            {models.map((model) => (
              <SelectListItem<LLMEndpoint>
                key={model.id}
                height={120}
                label={model.name}
                onClick={handleModelClick}
                iconName={IconName.OutlineBox}
                item={model}
              />
            ))}
            <li
              className="flex flex-row gap-2 border border-dashed dark:border-moongray-200
                bg-moongray-950 rounded-xl p-8 items-center cursor-pointer
                dark:hover:bg-moongray-900 mb-[15px] justify-between"
              style={{ flexBasis: '49%' }}
              onClick={handleCreateNewEndpoint}>
              <div className="flex flex-col w-full">
                <h4 className="text-white text-center text-[1.3rem]">
                  Testing a new Endpoint?
                </h4>
                <p className="text-center text-logocolor">
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
