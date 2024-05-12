'use client';
import { colors } from '@/app/views/shared-components/customColors';
import { Icon, IconName } from '@components/IconSVG';
import { Tooltip, TooltipPosition } from '@components/tooltip';
import Link from 'next/link';

function LeftNav() {
  return (
    <ul className="flex flex-col gap-10">
      <li>
        <Icon
          color={colors.moongray[300]}
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
          <Link href="/benchmarking">
            <Icon
              color={colors.moongray[300]}
              name={IconName.CheckList}
              size={40}
            />
          </Link>
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
            color={colors.moongray[300]}
            name={IconName.Spacesuit}
            size={40}
          />
        </Tooltip>
      </li>
      <li>
        <Icon
          color={colors.moongray[300]}
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
            color={colors.moongray[300]}
            name={IconName.Tools}
            size={40}
          />
        </Tooltip>
      </li>
    </ul>
  );
}

export default LeftNav;
