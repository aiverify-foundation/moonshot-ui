import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type LLMDetailsCardProps = {
  endpoint: LLMEndpoint;
};

function LLMDetailsCard(props: LLMDetailsCardProps) {
  const { endpoint } = props;
  return (
    <div>
      <KeyValueDisplay
        label="ID"
        value={endpoint.id}
      />
      <KeyValueDisplay
        label="Endpoint Name"
        value={endpoint.name}
      />
      <KeyValueDisplay
        label="Type"
        value={endpoint.connector_type}
      />
      <KeyValueDisplay
        label="URI"
        value={endpoint.uri}
      />
      <KeyValueDisplay
        label="Max Calls / second"
        value={endpoint.max_calls_per_second.toString()}
      />
      <KeyValueDisplay
        label="Max Concurrency"
        value={endpoint.max_concurrency.toString()}
      />
      <KeyValueDisplay
        label="API Token"
        value={
          endpoint.token.substring(0, Math.ceil(endpoint.token.length / 2)) +
          '*'.repeat(Math.floor(endpoint.token.length / 2))
        }
      />
      <KeyValueDisplay
        label="Additional Params"
        value={JSON.stringify(endpoint.params, null, 2)}
      />
    </div>
  );
}

export { LLMDetailsCard };
