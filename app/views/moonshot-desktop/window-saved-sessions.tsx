import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList, WindowListItem } from '@/app/components/window-list';

type WindowSavedSessionsProps = {
  onCloseClick: () => void
}

const sessions: WindowListItem[] = [
  { id: 'test-1', displayName: 'test-1' },
  { id: 'test-2', displayName: 'test-2' },
  { id: 'test-3', displayName: 'test-3' }
]

function WindowSavedSessions(props: WindowSavedSessionsProps) {
  const { onCloseClick } = props;
  return <Window initialXY={[600, 200]}
    onCloseClick={onCloseClick}
    name="Saved Sessions"
    styles={{ width: 600, height: 470 }}>
    <div style={{ display: 'flex' }}>
      <WindowList items={sessions} styles={{ flexBasis: '50%' }} />
      <WindowInfoPanel><div>hello world</div></WindowInfoPanel>
    </div>
  </Window>;
}

export { WindowSavedSessions }
