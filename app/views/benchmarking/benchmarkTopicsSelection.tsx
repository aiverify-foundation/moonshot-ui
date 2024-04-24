import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

type Props = {
  topics: BenchmarkTopic[];
  selectedTopics: BenchmarkTopic[];
  onTopicClick: (topic: BenchmarkTopic) => void;
};

function BenchmarkTopicsSelection({
  topics,
  selectedTopics,
  onTopicClick,
}: Props) {
  return (
    <section className="flex flex-col items-center min-h-[300px]">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
        Would you like to test any of these?
      </h2>
      <p className="text-[1.1rem] text-moongray-300 w-full text-center py-0">
        <span className="font-bold">Optional tests</span> to evaluate a
        model&apos;s performance in specific topics or languages
      </p>
      <div className="flex flex-wrap gap-4 mt-10 w-[80%] justify-center">
        {topics.map((topic) => {
          const isSelected = selectedTopics.some((t) => t.id === topic.id);
          return (
            <Button
              key={topic.id}
              size="sm"
              text={topic.name}
              textSize="1.1rem"
              textWeight="600"
              textColor={colors.white}
              mode={ButtonType.OUTLINE}
              type="button"
              leftIconName={IconName.Plus}
              btnColor={isSelected ? colors.moongray[700] : undefined}
              hoverBtnColor={colors.moongray[800]}
              onClick={() => onTopicClick(topic)}
            />
          );
        })}
      </div>
    </section>
  );
}

export { BenchmarkTopicsSelection };
