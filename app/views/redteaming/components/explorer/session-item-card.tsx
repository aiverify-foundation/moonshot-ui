import { Icon, IconName } from '@/app/components/IconSVG';

type SessionItemCardProps = {
  session: Session;
};

function SessionItemCard(props: SessionItemCardProps) {
  const { session } = props;
  const models = session.endpoints.join(', ');
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 pb-2">
        <Icon
          name={IconName.SolidBox}
          size={16}
          color="#475569"
        />
        <div className="font-bold">{session.name}</div>
      </div>
      <div className="flex items-start gap-2">
        <div className="font-medium">Models:</div>
        <div>{models}</div>
      </div>
      <div className="flex items-center gap-2">
        <div>{session.description}</div>
      </div>
    </div>
  );
}

export { SessionItemCard };
