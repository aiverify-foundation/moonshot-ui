'use client';

import React, { useEffect } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useAppSelector } from '@/lib/redux';
import tailwindConfig from '@/tailwind.config';
import { EntryBanners } from './components/entryBanners';
import { MicroLayout } from './components/microLayout';
import { NewRedTeamSession } from './components/newRedteamSession';
import { MainSectionViews } from './enums';
import { WindowIds } from '@views/moonshot-desktop/constants';
import { useResetWindows } from '@views/moonshot-desktop/hooks/useResetWindows';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

export default function QuickstartHome() {
  const [activeView, setActiveView] = React.useState<MainSectionViews>(
    MainSectionViews.QUICKSTART_HOME
  );

  const isDarkMode = useAppSelector((state) => state.darkMode.value);
  const resetWindows = useResetWindows();

  function changeView(view: MainSectionViews) {
    setActiveView(view);
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    //set default window dimensions
    //position will be centralized with small random offsets to left/top positions on screen
    resetWindows(
      WindowIds.COOKBOOKS_PICKER,
      WindowIds.RECIPES_PICKER,
      WindowIds.LLM_ENDPOINTS_PICKER
    );
  }, []);

  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <ul className="flex flex-col gap-10">
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.OutlineBox}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.CheckList}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.Spacesuit}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.HistoryClock}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.Tools}
              size={50}
            />
          </li>
        </ul>
      </nav>
      <header className="flex justify-between items-center px-4">
        <h1
          className="text-logocolor tracking-[0.7rem] font-extralight text-[2.7rem] cursor-pointer"
          onClick={() => changeView(MainSectionViews.QUICKSTART_HOME)}>
          moonshot.
        </h1>
        <Icon
          darkModeColor={colors.moongray[300]}
          name={IconName.Bell}
          size={30}
        />
      </header>
      <main>
        {activeView === MainSectionViews.QUICKSTART_HOME && (
          <EntryBanners changeView={changeView} />
        )}
        {activeView === MainSectionViews.REDTEAMING && (
          <NewRedTeamSession
            onCloseIconClick={() =>
              changeView(MainSectionViews.QUICKSTART_HOME)
            }
          />
        )}
      </main>
    </MicroLayout>
  );
}
