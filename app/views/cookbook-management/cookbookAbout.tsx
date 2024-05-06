import { Icon, IconName } from '@/app/components/IconSVG';

type Props = {
  cookbook: Cookbook;
  checked: boolean;
};

function CookbookAbout({ cookbook, checked }: Props) {
  return (
    <section className="flex flex-nowrap gap-5 text-white p-6 bg-moongray-800 m-2 h-full rounded-xl">
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
        <p className="text-moongray-200">7,9000 prompts</p>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <h4 className="text-[0.9rem] font-bold">
          {cookbook.recipes.length} Recipes in this cookbook
        </h4>
        <ul
          className="flex flex-col flex-wrap gap-[2%] w-[100%]
          overflow-y-auto custom-scrollbar px-4
          bg-moongray-950 rounded-xl h-full">
          {cookbook.recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex flex-col gap-2 p-4 border-b border-moongray-800">
              <div className="flex gap-2">
                <Icon name={IconName.File} />
                <p>{recipe.name}</p>
              </div>
              <p className="text-[0.9rem]">{recipe.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { CookbookAbout };
