import React, { useEffect, useState, useTransition } from 'react';
import { getRecipesById } from '@/actions/getRecipesById';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput } from '@/app/components/selectInput';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import { getEmbeddingEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';
import { ConfigureEndpointSmallCard } from './configureEndpointSmallCard';

type ConfigureRequirementsItemCardProps = {
  cookbook: Cookbook;
  requiredEndpoints: LLMEndpoint[];
  onConfigureEndpointClick: (endpoint: LLMEndpoint) => void;
  onUploadDatasetClick: (cookbook: Cookbook) => void;
  onAboutClick: (cookbook: Cookbook) => void;
};

function ConfigureRequirementsItemCard(
  props: ConfigureRequirementsItemCardProps
) {
  const {
    cookbook,
    requiredEndpoints,
    onConfigureEndpointClick,
    onUploadDatasetClick,
    onAboutClick,
  } = props;

  const [isPending, startTransition] = useTransition();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function callServerAction() {
      startTransition(async () => {
        const result = await getRecipesById(cookbook.recipes);
        if (result.status === 'success') {
          setRecipes(result.data);
        }
      });
    }
    if (cookbook.recipes.length > 0) {
      callServerAction();
    }
  }, []);

  const embeddingEndpoints = getEmbeddingEndpointsFromRequiredConfig(
    cookbook.required_config
  );

  function handleUploadDatasetBtnClick() {
    onUploadDatasetClick(cookbook);
  }

  const leftSection = (
    <div className="flex flex-col gap-2 flex-1 pr-4">
      <div className="flex items-start gap-2">
        <Icon
          name={IconName.Book}
          style={{ marginTop: '4px' }}
        />
        <h2 className="text-[1.1rem] leading-snug tracking-wide text-white w-full">
          {cookbook.name}
        </h2>
        <Button
          mode={ButtonType.LINK}
          size="lg"
          text="About"
          onClick={() => onAboutClick(cookbook)}
        />
      </div>
      {requiredEndpoints.length > 0 ? (
        <p className="text-[0.9rem] leading-snug tracking-wide w-full ml-8 mt-8 text-moongray-400">
          <h3 className="font-bold">Requires</h3>
          <ul className="list-disc list-inside">
            {requiredEndpoints.map((endpoint) => (
              <li key={endpoint.id}>{endpoint.name}</li>
            ))}
          </ul>
        </p>
      ) : null}
    </div>
  );

  const recipesDatasetsDropdowns =
    !isPending && embeddingEndpoints.length > 0 ? (
      <div className="flex flex-col gap-4">
        {recipes.map((recipe) => {
          const options = recipe.datasets.map((dataset) => ({
            label: dataset,
            value: dataset,
          }));
          return (
            <div
              key={recipe.id}
              className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Icon name={IconName.File} />
                <h4 className="text-white">{recipe.name}</h4>
              </div>
              <SelectInput
                name="dataset"
                options={options}
                value={recipe.datasets[0]}
                onChange={() => {}}
                style={{ marginBottom: 0, width: 400 }}
              />
            </div>
          );
        })}
      </div>
    ) : null;

  const customTestingDataSection =
    !isPending && embeddingEndpoints.length > 0 ? (
      <div className="flex flex-col gap-2 flex-1 pr-4">
        <div className="flex items-center gap-2 w-full">
          <h4 className=" text-white">Set custom testing data</h4>
          <Tooltip
            content="This recipe requires you to set a testing dataset that contains inputs relevant to your use case, and their respective target response."
            position={TooltipPosition.right}
            offsetLeft={10}>
            <Icon
              name={IconName.Alert}
              color={colors.moonpurplelight}
            />
          </Tooltip>
        </div>
        <div className="flex gap-2 mt-2">
          <p className="text-moongray-400">Select an existing dataset or</p>
          <Button
            mode={ButtonType.OUTLINE}
            hoverBtnColor={colors.moongray[700]}
            pressedBtnColor={colors.moongray[900]}
            size="sm"
            text="Upload dataset"
            onClick={handleUploadDatasetBtnClick}
          />
        </div>
        {recipesDatasetsDropdowns}
      </div>
    ) : null;

  const connectModelsSection =
    requiredEndpoints.length > 0 ? (
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 w-full">
          <h4 className=" text-white">Connect evaluator models</h4>
          <Tooltip
            content="This recipe requires connection to evaluator models to help score the tests. You will need to provide the API access tokens or set up an alternative evaluator model."
            position={TooltipPosition.right}
            offsetLeft={10}>
            <Icon
              name={IconName.Alert}
              color={colors.moonpurplelight}
            />
          </Tooltip>
        </div>
        <p className="text-moongray-400">
          Ensure that Moonshot has access to these endpoints.
        </p>
        {requiredEndpoints.map((endpoint) => (
          <ConfigureEndpointSmallCard
            key={endpoint.id}
            endpoint={endpoint}
            onConfigureClick={onConfigureEndpointClick}
          />
        ))}
      </div>
    ) : null;

  const rightSection = (
    <section className="flex flex-col gap-2 flex-1 px-4">
      {customTestingDataSection}
      {embeddingEndpoints.length > 0 ? (
        <div className="h-[1px] w-full mt-8 bg-moongray-800" />
      ) : null}
      {connectModelsSection}
    </section>
  );

  return (
    <figure className="flex border rounded-xl p-4 border-moongray-800 w-full">
      {leftSection}
      <div className="w-[1px] h-full bg-moongray-800" />
      {rightSection}
    </figure>
  );
}

export { ConfigureRequirementsItemCard };
