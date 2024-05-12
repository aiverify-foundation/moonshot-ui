import { Icon, IconName } from '@/app/components/IconSVG';

type TemplateItemCardProps = {
  template: PromptTemplate;
  className?: string;
};

function TemplateItemCard(props: TemplateItemCardProps) {
  const { template, className } = props;
  return (
    <div className={`flex flex-col items-start py-2 w-full ${className}`}>
      <div className="flex items-center gap-2 pb-2">
        <Icon
          name={IconName.ChatBubbleWide}
          size={16}
          color="#475569"
        />
        <div className="font-bold">{template.name}</div>
      </div>
      <div className="flex items-start gap-2 w-full">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-4">
          {template.description}
        </div>
      </div>
    </div>
  );
}

export { TemplateItemCard };
