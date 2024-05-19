'use client';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { AttackModuleSelectView } from '@/app/views/attackmodules/attackModuleSelector';
import { EndpointSelectVew } from '@/app/views/models-management/endpointsSelector';
import { NewEndpointForm } from '@/app/views/models-management/newEnpointForm';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Modal } from '@/app/views/shared-components/modal/modal';

function CookbooksViewList() {
  return (
    <MainSectionSurface
      onCloseIconClick={() => null}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="flex flex-col items-center h-full">
        <div
          className="flex flex-col gap-5 justify-center w-full"
          style={{ height: 'calc(100% - 33px)' }}>
          <h1>Cookbooks</h1>
        </div>
      </div>
    </MainSectionSurface>
  );
}

export { CookbooksViewList };
