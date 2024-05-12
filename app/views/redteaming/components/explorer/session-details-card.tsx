import { Icon, IconName } from '@/app/components/IconSVG';
import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type SessionDetailsCardProps = {
  session: Session;
  onResumeSessionClick: () => void;
};

function SessionDetailsCard(props: SessionDetailsCardProps) {
  const { session, onResumeSessionClick } = props;
  return (
    <div>
      <KeyValueDisplay
        label="Session Name"
        value={session.name}
      />
      <KeyValueDisplay
        label="Session ID"
        value={session.session_id}
      />
      <KeyValueDisplay
        label="Endpoints"
        value={session.endpoints.map((endpoint) => endpoint).join(', ')}
      />
      <KeyValueDisplay
        label="Metadata File"
        value={session.metadata_file}
      />
      <KeyValueDisplay
        label="Created At"
        value={new Date(session.created_epoch * 1000).toLocaleString()}
      />
      <KeyValueDisplay
        label="Last Prompt Template set"
        value={session.prompt_template || 'No Template'}
      />
      <KeyValueDisplay
        label="Last Context Strategy used"
        value={
          session.context_strategy != undefined
            ? session.context_strategy.toString()
            : 'No Strategy'
        }
      />
      <div className="mt-10 flex justify-start">
        <button
          className="flex btn-primary items-center gap-2 btn-large rounded"
          type="button"
          onClick={onResumeSessionClick}>
          <div>Resume Session</div>
          <Icon
            name={IconName.ArrowRight}
            color="#FFFFFF"
            size={14}
          />
        </button>
      </div>
    </div>
  );
}

export { SessionDetailsCard };
