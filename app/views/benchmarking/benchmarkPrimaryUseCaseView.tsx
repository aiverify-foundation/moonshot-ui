import { IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import tailwindConfig from '@/tailwind.config';
import { BenchmarkNewSessionViews } from './enums';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type Props = {
  changeView: (view: BenchmarkNewSessionViews) => void;
};

function BenchMarkPrimaryUseCaseView({ changeView }: Props) {
  return (
    <section className="flex flex-col items-center min-h-[300px]">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center mb-10">
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
            onClick={() =>
              changeView(BenchmarkNewSessionViews.TOPICS_SELECTION)
            }
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
    </section>
  );
}

export { BenchMarkPrimaryUseCaseView };
