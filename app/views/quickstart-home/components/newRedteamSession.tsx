import { ModelSelectView } from './endpointsSelector';
import { MainSectionSurface } from './mainSectionSurface';

type Props = {
  onCloseIconClick: () => void;
};

function NewRedTeamSession(props: Props) {
  const { onCloseIconClick } = props;
  return (
    <MainSectionSurface onCloseIconClick={onCloseIconClick}>
      <ModelSelectView />
    </MainSectionSurface>
  );
}

export { NewRedTeamSession };
