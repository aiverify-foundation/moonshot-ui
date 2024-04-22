import { Icon, IconName } from '@/app/components/IconSVG';
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
      <div className="flex flex-col gap-2 w-full">
        <Icon
          name={IconName.WideArrowDown}
          size={40}
        />
      </div>
    </MainSectionSurface>
  );
}

export { NewRedTeamSession };
