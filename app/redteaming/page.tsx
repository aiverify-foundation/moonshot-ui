'use client';
import { ManualRedTeaming } from './red-teaming-session';
import { Z_Index } from '@views/moonshot-desktop/constants';

export default function Page() {
  return (
    <ManualRedTeaming
      zIndex={Z_Index.Level_2}
      onCloseBtnClick={() => null}
    />
  );
}
