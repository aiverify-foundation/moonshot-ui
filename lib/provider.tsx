'use client';

/* Core */
import { Provider } from 'react-redux';

/* Instruments */
import { applicationStore } from '@/lib/redux';

export const Providers = (props: React.PropsWithChildren) => {
  return <Provider store={applicationStore}>{props.children}</Provider>;
};
