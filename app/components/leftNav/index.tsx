'use client';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { CustomLink } from '@/app/components/customLink';
import { colors } from '@/app/customColors';

type menuItem =
  | 'benchmarking'
  | 'redteaming'
  | 'endpoints'
  | 'history'
  | 'utils';
type LeftNavProps = {
  activeItem?: menuItem;
};
function LeftNav({ activeItem }: LeftNavProps) {
  const [hoveredItem, setHoveredItem] = React.useState<menuItem | undefined>();

  return (
    <ul className="flex flex-col gap-10">
      <li className="flex justify-center">
        <CustomLink
          href="/endpoints"
          onMouseEnter={() => setHoveredItem('endpoints')}
          onMouseLeave={() => setHoveredItem(undefined)}
          className="relative">
          {(hoveredItem === 'endpoints' || activeItem === 'endpoints') && (
            <p className="absolute tracking-wider text-moonpurplelight right-[50px] w-[200px] text-right">
              model endpoints
            </p>
          )}
          <Icon
            color={
              activeItem === 'endpoints'
                ? colors.moonpurplelight
                : hoveredItem === 'endpoints'
                  ? colors.moonpurplelight
                  : colors.moongray[300]
            }
            name={IconName.OutlineBox}
            size={40}
          />
        </CustomLink>
      </li>
      <li className="flex justify-center">
        <CustomLink
          href="/benchmarking"
          onMouseEnter={() => setHoveredItem('benchmarking')}
          onMouseLeave={() => setHoveredItem(undefined)}
          className="relative">
          {(hoveredItem === 'benchmarking' ||
            activeItem === 'benchmarking') && (
            <p className="absolute tracking-wider text-moonpurplelight right-[50px] w-[200px] text-right">
              benchmarking
            </p>
          )}
          <Icon
            color={
              activeItem === 'benchmarking'
                ? colors.moonpurplelight
                : hoveredItem === 'benchmarking'
                  ? colors.moonpurplelight
                  : colors.moongray[300]
            }
            name={IconName.CheckList}
            size={40}
          />
        </CustomLink>
      </li>
      <li className="flex justify-center">
        <CustomLink
          href="/redteaming"
          onMouseEnter={() => setHoveredItem('redteaming')}
          onMouseLeave={() => setHoveredItem(undefined)}
          className="relative">
          {(hoveredItem === 'redteaming' || activeItem === 'redteaming') && (
            <p className="absolute tracking-wider text-moonpurplelight right-[50px] w-[200px] text-right">
              red teaming
            </p>
          )}
          <Icon
            color={
              activeItem === 'redteaming'
                ? colors.moonpurplelight
                : hoveredItem === 'redteaming'
                  ? colors.moonpurplelight
                  : colors.moongray[300]
            }
            name={IconName.Spacesuit}
            size={40}
          />
        </CustomLink>
      </li>
      <li>
        <CustomLink
          href="/history"
          onMouseEnter={() => setHoveredItem('history')}
          onMouseLeave={() => setHoveredItem(undefined)}
          className="relative">
          {(hoveredItem === 'history' || activeItem === 'history') && (
            <p className="absolute tracking-wider text-moonpurplelight right-[80px] w-[200px] text-right">
              history
            </p>
          )}
          <Icon
            color={
              activeItem === 'history'
                ? colors.moonpurplelight
                : hoveredItem === 'history'
                  ? colors.moonpurplelight
                  : colors.moongray[300]
            }
            name={IconName.HistoryClock}
            size={40}
          />
        </CustomLink>
      </li>
      <li className="flex justify-center">
        <CustomLink
          href="/utilities"
          onMouseEnter={() => setHoveredItem('utils')}
          onMouseLeave={() => setHoveredItem(undefined)}
          className="relative">
          {(hoveredItem === 'utils' || activeItem === 'utils') && (
            <p className="absolute tracking-wider text-moonpurplelight right-[50px] w-[200px] text-right">
              utils
            </p>
          )}
          <Icon
            color={
              activeItem === 'utils'
                ? colors.moonpurplelight
                : hoveredItem === 'utils'
                  ? colors.moonpurplelight
                  : colors.moongray[300]
            }
            name={IconName.Tools}
            size={40}
          />
        </CustomLink>
      </li>
    </ul>
  );
}

export default LeftNav;
