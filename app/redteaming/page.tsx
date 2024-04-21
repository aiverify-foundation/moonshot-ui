'use client';
import { Z_Index } from '@views/moonshot-desktop/constants';
import { ManualRedTeaming } from './red-teaming-session';

export default function Page() {
  return (
    <ManualRedTeaming
      zIndex={Z_Index.Level_2}
      onCloseBtnClick={() => null}
    />
  );
}
