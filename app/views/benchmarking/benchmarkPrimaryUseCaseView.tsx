import { IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import SimpleStepIndicator from '@/app/components/simpleStepIndicator';
import { MainSectionSurface } from '@/app/views/quickstart-home/components/mainSectionSurface';
import { MainSectionViews } from '@/app/views/quickstart-home/enums';
import tailwindConfig from '@/tailwind.config';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type Props = {
  changeView: (view: MainSectionViews) => void;
};

function BenchMarkPrimaryUseCaseView({ changeView }: Props) {
  return (
    <MainSectionSurface
      onCloseIconClick={() => changeView(MainSectionViews.BENCHMARK_SUBMENU)}>
      <div className="flex flex-col pt-4 gap-10 pb-10">
        <SimpleStepIndicator steps={['Summarisation', 'QnA', 'General']} currentStepIndex={0} />
        <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
          What is your Primary Use Case?
        </h2>

        <div className="relative flex flex-row justify-center">
          <div className="col-span-3 grid grid-cols-3 gap-[1.7%] w-[700px]">
            <ActionCard
              title="Summarisation"
              titleSize={16}
              iconSize={40}
              descriptionColor={colors.moongray[300]}
              cardColor={colors.moongray[800]}
              iconName={IconName.Document}
              height={200}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => {
                console.log('clicked');
              }}
            />
            <ActionCard
              title="QnA"
              titleSize={16}
              iconSize={40}
              descriptionColor={colors.moongray[300]}
              cardColor={colors.moongray[800]}
              iconName={IconName.TalkBubbles}
              height={200}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => console.log('clicked')}
            />
            <ActionCard
              title="General"
              titleSize={16}
              iconSize={40}
              descriptionColor={colors.moongray[300]}
              cardColor={colors.moongray[800]}
              iconName={IconName.Lightning}
              height={200}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => {
                console.log('clicked');
              }}
            />
          </div>
        </div>
      </div>
    </MainSectionSurface>
  );
}

export { BenchMarkPrimaryUseCaseView };
