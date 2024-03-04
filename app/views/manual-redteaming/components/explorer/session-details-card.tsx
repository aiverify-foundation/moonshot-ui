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
