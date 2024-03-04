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
      <div className="mt-6">
        <button
          className="btn-primary"
          type="button"
          onClick={onResumeSessionClick}>
          Resume Session
        </button>
      </div>
    </div>
  );
}

export { SessionDetailsCard };
