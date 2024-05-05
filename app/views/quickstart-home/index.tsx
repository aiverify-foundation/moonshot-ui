'use client';

import React, { useEffect } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { getWindowId } from '@/app/lib/window-utils';
import { BenchmarkHome } from '@/app/views/benchmarking/benchmarkHome';
import {
  removeActiveSession,
  removeOpenedWindowId,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import tailwindConfig from '@/tailwind.config';
import { EntryBanners } from './components/entryBanners';
import { MicroLayout } from './components/microLayout';
import { NewRedTeamSession } from './components/newRedteamSession';
import { RedteamSubmenu } from './components/redteamSubmenu';
import { UtilsSubmenu } from './components/utilsSubmenu';
import { MainSectionViews } from './enums';
import { WindowIds, Z_Index } from '@views/moonshot-desktop/constants';
import { useResetWindows } from '@views/moonshot-desktop/hooks/useResetWindows';
import { ManualRedTeamingV2 } from '@views/redteaming/red-teaming-session-v2';
import LeftNav from '@/app/components/leftNav';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

export default function QuickstartHome() {
  const [currentView, setCurrentView] = React.useState<MainSectionViews>(
    MainSectionViews.QUICKSTART_HOME
  );
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.darkMode.value);
  const resetWindows = useResetWindows();
  const openedWindowIds = useAppSelector(
    (state) => state.windows.openedWindowIds
  );

  function changeView(view: MainSectionViews) {
    setCurrentView(view);
  }

  function handleRedteamingSessionCloseClick() {
    dispatch(removeActiveSession());
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.RED_TEAMING_SESSION)));
    changeView(MainSectionViews.QUICKSTART_HOME);
  }

  function goToHomeScreen() {
    changeView(MainSectionViews.QUICKSTART_HOME);
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const leftNavMenuItems = (
    <ul className="flex flex-col gap-10">
      <li>
        <Icon
          darkModeColor={colors.moongray[300]}
          name={IconName.OutlineBox}
          size={40}
        />
      </li>
      <li className="flex justify-center">
        <Tooltip
          content={<span className="tracking-widest">benchmarking</span>}
          fontColor={colors.moonpurplelight}
          transparent
          position={TooltipPosition.left}
          offsetTop={10}>
          <Icon
            darkModeColor={colors.moongray[300]}
            name={IconName.CheckList}
            size={40}
            onClick={() => changeView(MainSectionViews.BENCHMARK_SUBMENU)}
          />
        </Tooltip>
      </li>
      <li className="flex justify-center">
        <Tooltip
          content={<span className="tracking-widest">red teaming</span>}
          fontColor={colors.moonpurplelight}
          transparent
          position={TooltipPosition.left}
          offsetTop={10}>
          <Icon
            darkModeColor={colors.moongray[300]}
            name={IconName.Spacesuit}
            size={40}
            onClick={() => changeView(MainSectionViews.REDTEAM_SUBMENU)}
          />
        </Tooltip>
      </li>
      <li>
        <Icon
          darkModeColor={colors.moongray[300]}
          name={IconName.HistoryClock}
          size={40}
        />
      </li>
      <li className="flex justify-center">
        <Tooltip
          content={<span className="tracking-widest">utilities</span>}
          fontColor={colors.moonpurplelight}
          position={TooltipPosition.left}
          transparent
          offsetTop={10}>
          <Icon
            darkModeColor={colors.moongray[300]}
            name={IconName.Tools}
            size={40}
            onClick={() => changeView(MainSectionViews.UTILS_SUBMENU)}
          />
        </Tooltip>
      </li>
    </ul>
  );

  let view: React.ReactNode = <EntryBanners changeView={changeView} />;
  switch (currentView) {
    case MainSectionViews.BENCHMARK_SUBMENU:
      view = <BenchmarkHome />;
      break;
    case MainSectionViews.REDTEAM_SUBMENU:
      view = (
        <RedteamSubmenu
          onBackClick={goToHomeScreen}
          changeView={changeView}
        />
      );
      break;
    case MainSectionViews.UTILS_SUBMENU:
      view = (
        <UtilsSubmenu
          onClick={() => changeView(MainSectionViews.UTILS_SUBMENU)}
          onBackClick={goToHomeScreen}
        />
      );
      break;
    case MainSectionViews.REDTEAMING:
      view = <NewRedTeamSession onCloseIconClick={goToHomeScreen} />;
      break;
  }

  return (
    <>
      {openedWindowIds.includes(getWindowId(WindowIds.RED_TEAMING_SESSION)) ? (
        <ManualRedTeamingV2
          zIndex={Z_Index.Level_2}
          onCloseBtnClick={handleRedteamingSessionCloseClick}
        />
      ) : (
        <MicroLayout>
          <nav className="pt-[5rem]">
            <LeftNav />
          </nav>
          <header className="flex justify-between items-center px-4">
            <h1
              className="text-moonpurplelight tracking-[0.7rem] font-extralight text-[2.7rem] cursor-pointer"
              style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.5)' }}
              onClick={goToHomeScreen}>
              moonshot.
            </h1>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.Bell}
              size={30}
            />
          </header>
          <main className="h-full">{view}</main>
        </MicroLayout>
      )}
    </>
  );
}
