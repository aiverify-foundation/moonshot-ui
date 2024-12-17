import React from 'react';
import { ConfigureRequirementsItemCard } from './configureRequirementsItemCard';
type ConfigureAdditionalRequirementsProps = {
  cookbooks: Cookbook[];
};

function ConfigureAdditionalRequirements(
  props: ConfigureAdditionalRequirementsProps
) {
  const { cookbooks } = props;
  return (
    <React.Fragment>
      <section className="flex flex-col items-center justify-top gap-5 px-8 h-full">
        <h2 className="text-[1.6rem] leading-[2rem] tracking-wide text-white w-full text-center pt-4">
          Provide these additional requirements
        </h2>
        {cookbooks.map((cookbook) => (
          <ConfigureRequirementsItemCard
            key={cookbook.id}
            cookbook={cookbook}
          />
        ))}
      </section>
    </React.Fragment>
  );
}

export { ConfigureAdditionalRequirements };
