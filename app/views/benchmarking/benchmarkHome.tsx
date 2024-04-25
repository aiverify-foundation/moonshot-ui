import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
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

  function changeView(view: BenchmarkHomeViews) {
    setActiveView(view);
  }

  return (
    <div className="flex flex-col p-8 gap-6">
      <header>
        <button onClick={onBackClick}>
          <div className="flex gap-3">
            <Icon
              name={IconName.ArrowLeft}
              darkModeColor={colors.moongray[200]}
              onClick={onBackClick}
            />
            <p className="text-moongray-200">Back to Home</p>
          </div>
        </button>
      </header>
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
