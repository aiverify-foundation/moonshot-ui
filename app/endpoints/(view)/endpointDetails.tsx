import { Icon, IconName } from '@/app/components/IconSVG';

type EndpointDetailsProps = {
  endpoint: LLMEndpoint;
};

function EndpointDetails({ endpoint }: EndpointDetailsProps) {
  return (
    <section className="text-white border border-moonwine-500 p-4 rounded-md overflow-y-auto custom-scrollbar bg-moongray-800">
      <div className="flex gap-2 mb-4">
        <Icon
          name={IconName.OutlineBox}
          size={24}
        />
        <h3 className="text-[1.2rem] font-semibold">{endpoint.name}</h3>
      </div>
      <p className="text-[0.95rem] mb-10">
        <span className="font-semibold">Type</span>
        &nbsp;
        <span className="text-moongray-300">{endpoint.connector_type}</span>
      </p>
      <h4 className="text-[1rem] font-semibold mb-1">URI</h4>
      <p className="text-[0.95rem] text-moongray-300 mb-4">
        {endpoint.uri || 'Not set'}
      </p>
      <h4 className="text-[1rem] font-semibold mb-2">Token</h4>
      <p className="text-[0.95rem] text-moongray-300 mb-4">
        {endpoint.token || 'Not set'}
      </p>
      <h4 className="text-[1rem] font-semibold mb-1">
        Max number of calls per second
      </h4>
      <p className="text-[0.95rem] text-moongray-300 mb-4">
        {endpoint.max_calls_per_second || 'None'}
      </p>
      <h4 className="text-[1rem] font-semibold mb-1">Max concurrency</h4>
      <p className="text-[0.95rem] text-moongray-300 mb-4">
        {endpoint.max_concurrency || 'None'}
      </p>
      <h4 className="text-[1rem] font-semibold mb-1">Parameters</h4>
      <pre className="text-[0.95rem] text-moongray-300 mb-4 overflow-hidden w-[90%] whitespace-pre-wrap">
        {JSON.stringify(endpoint.params, null, 2)}
      </pre>
    </section>
  );
}

export { EndpointDetails };
