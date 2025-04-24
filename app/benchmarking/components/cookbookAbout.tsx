import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { Checkbox } from '@/app/components/checkbox';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { colors } from '@/app/customColors';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';

type Props = {
  cookbook: Cookbook;
  checked: boolean;
  onSelectChange: (cb: Cookbook) => void;
};

function CookbookAbout({ cookbook, checked, onSelectChange }: Props) {
  const { data: recipes, isFetching } = useGetAllRecipesQuery({
    ids: cookbook.recipes,
    count: true,
  });
  const requiredEndpoints = getEndpointsFromRequiredConfig(
    cookbook.required_config
  );

  return (
    <section className="flex flex-nowrap gap-5 text-white p-6 bg-moongray-800 h-full rounded-xl">
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex gap-4 pb-4 overflow-hidden items-start">
          <Icon
            name={IconName.Book}
            size={25}
            style={{ marginTop: 5 }}
          />
          <h3 className="text-[1.4rem] font-bold w-[500px] break-words max-h-[500px]">
            {cookbook.name}
          </h3>
        </div>
        <div className="flex gap-3">
          <Checkbox
            label="Run this cookbook"
            size="l"
            ariaLabel={`Select ${cookbook.id}`}
            checked={checked}
            onChange={() => onSelectChange(cookbook)}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-4 mt-2">
          {cookbook.tags?.map((tagName) => (
            <Button
              key={tagName}
              mode={ButtonType.OUTLINE}
              text={tagName}
              textSize="0.8rem"
              size="sm"
              btnColor={colors.moonpurple}
              hoverBtnColor={colors.moonpurple}
            />
          ))}
        </div>
        <p className="text-[0.9rem] text-moongray-200 break-words overflow-hidden max-w-[500px]">
          {cookbook.description}
        </p>
        <div>
          {requiredEndpoints ? (
            <div className="text-moongray-200 mb-6">
              <h3 className="font-semibold">Requires</h3>
              <ul className="list-disc pl-5">
                {requiredEndpoints.map((endpoint) => (
                  <li key={endpoint}>{endpoint}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-moongray-200">
            {cookbook.total_prompt_in_cookbook} prompts
          </p>
          <p className="text-moongray-200">
            {cookbook.total_dataset_in_cookbook} datasets
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <h4 className="">{cookbook.recipes.length} Recipes in this cookbook</h4>
        <div
          className="w-full rounded-xl bg-moongray-950 py-3 pr-1"
          style={{ height: 'calc(100% - 25px)' }}>
          <ul className="relative flex flex-col h-full overflow-y-auto custom-scrollbar pl-3 pr-5">
            {isFetching && <LoadingAnimation />}
            {!isFetching &&
              recipes &&
              recipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="flex flex-col gap-2 p-4 border-b border-moongray-800">
                  <div className="flex gap-2">
                    <Icon name={IconName.File} />
                    <h3 className="font-bold">{recipe.name}</h3>
                  </div>
                  <p className="text-[0.9rem]">{recipe.description}</p>
                  <div>
                    <p className="text-[0.9rem]">
                      {recipe.total_prompt_in_recipe} Prompts
                    </p>
                    <p className="text-[0.9rem]">
                      {recipe.stats.num_of_datasets}{' '}
                      {recipe.stats.num_of_datasets > 1
                        ? 'Datasets'
                        : 'Dataset'}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { CookbookAbout };
