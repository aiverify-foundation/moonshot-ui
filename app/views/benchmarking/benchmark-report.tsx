import { useEffect, useRef, useState } from 'react';
import { Window } from '@/app/components/window';
import { useGetBenchmarksResultQuery } from '@/app/services/benchmark-api-service';

type cookbooksExplorerProps = {
  windowId: string;
  benchmarkId: string;
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  onCloseClick: () => void;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

function BenchmarksResult(props: cookbooksExplorerProps) {
  const {
    windowId,
    benchmarkId,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    onCloseClick,
    onWindowChange,
  } = props;
  const { data, error, isLoading, refetch } = useGetBenchmarksResultQuery({
    benchmarkId: benchmarkId,
  });

  return (
    <Window
      id={windowId}
      resizeable={true}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}>
      <div>{JSON.stringify(data)}</div>
    </Window>
  );
}

export { BenchmarksResult };
