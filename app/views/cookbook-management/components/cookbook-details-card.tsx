import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type CookbookDetailsCardProps = {
  endpoint: LLMEndpoint;
};

function CookbookDetailsCard(props: CookbookDetailsCardProps) {
  const { endpoint } = props;
  return (
    <div>
      <KeyValueDisplay
        label="Endpoint Name"
        value={endpoint.name}
      />
      <KeyValueDisplay
        label="Type"
        value={endpoint.type}
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
    </div>
  );
}

export { CookbookDetailsCard };
