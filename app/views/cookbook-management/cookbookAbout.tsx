import { Icon, IconName } from '@/app/components/IconSVG';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';
import { LoadingAnimation } from '../shared-components/loadingAnimation';

type Props = {
  cookbook: Cookbook;
  checked: boolean;
};

function CookbookAbout({ cookbook, checked }: Props) {
  const {
    data: recipes,
    isFetching,
    isLoading,
    isError,
  } = useGetAllRecipesQuery({
    ids: cookbook.recipes,
    count: true,
  });
  return (
    <section className="flex flex-nowrap gap-5 text-white p-6 bg-moongray-800 h-full rounded-xl">
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex gap-4 pb-4">
          <Icon
            name={IconName.Book}
            size={25}
          />
          <h3 className="text-[1.4rem] font-bold">{cookbook.name}</h3>
        </div>
        <div className="flex gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => null}
          />
          <p className="text-[0.9rem]">Run this cookbook</p>
        </div>
        <p className="text-[0.9rem] text-moongray-200">
          {cookbook.description}
        </p>
        <p className="text-moongray-200">
          {cookbook.total_prompt_in_cookbook} prompts
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <h4 className="">{cookbook.recipes.length} Recipes in this cookbook</h4>
        <div className="w-full rounded-xl h-full bg-moongray-950 py-3 pr-1">
          <ul className="relative flex flex-col h-full overflow-y-auto custom-scrollbar px-4 ">
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
                  <p className="text-[0.9rem]">
                    {recipe.total_prompt_in_recipe} Prompts
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { CookbookAbout };
