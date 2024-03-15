import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type TemplateDetailsCardProps = {
  template: PromptTemplate;
};

function TemplateDetailsCard(props: TemplateDetailsCardProps) {
  const { template } = props;
  return (
    <div>
      <KeyValueDisplay
        label="Name"
        value={template.name}
      />
      <KeyValueDisplay
        label="Description"
        value={template.description}
      />
      <KeyValueDisplay
        label="Description"
        value={template.template}
      />
    </div>
  );
}

export { TemplateDetailsCard };
