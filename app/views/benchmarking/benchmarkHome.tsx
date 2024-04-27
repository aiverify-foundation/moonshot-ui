import React, { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import BackToHomeButton from '@/app/views/shared-components/backToHomeButton/backToHomeButton';
import tailwindConfig from '@/tailwind.config';
import { BenchmarkHomeMenu } from './benchmarkHomeMenu';
import { BenchmarkNewSessionFlow } from './benchmarkNewSessionFlow';
import { BenchmarkHomeViews } from './enums';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type BenchmarkHomeProps = {
  onBackClick: () => void;
};

function BenchmarkHome(props: BenchmarkHomeProps) {
  const { onBackClick } = props;

  const [activeView, setActiveView] = useState<BenchmarkHomeViews>(
    BenchmarkHomeViews.HOME
  );

  const showBackToHomeButton = activeView === BenchmarkHomeViews.HOME;

  function changeView(view: BenchmarkHomeViews) {
    setActiveView(view);
  }

  return (
    <div className="flex flex-col h-full">
      {showBackToHomeButton && (
        <header>
          <BackToHomeButton
            onBackClick={onBackClick}
            colors={colors}
          />
        </header>
      )}
      {activeView === BenchmarkHomeViews.HOME && (
        <BenchmarkHomeMenu changeView={changeView} />
      )}
      {activeView === BenchmarkHomeViews.NEW_SESSION && (
        <BenchmarkNewSessionFlow
          onCloseIconClick={() => changeView(BenchmarkHomeViews.HOME)}
        />
      )}
    </div>
  );
}

export { BenchmarkHome };
