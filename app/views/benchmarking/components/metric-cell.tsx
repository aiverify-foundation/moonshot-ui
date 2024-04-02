import { RougeDetailCell } from './rouge-detail-cell';

type MetricCellProps = {
  metricName: string;
  metricValue: number | ResultMetricBreakdown;
};

function MetricCell({ metricName, metricValue }: MetricCellProps) {
  return (
    <div
      key={metricName}
      className={`flex gap-2 px-2 w-full ${typeof metricValue != 'number' ? 'flex-col' : ''}`}>
      <div>{metricName}:</div>
      <div
        className={`w-full ${typeof metricValue == 'number' ? 'text-blue-700 font-bold' : ''}`}>
        {typeof metricValue == 'number' ? metricValue : null}
        {typeof metricValue != 'number' && metricName == 'rouge' ? (
          <RougeDetailCell data={metricValue} />
        ) : null}
      </div>
    </div>
  );
}

export { MetricCell };
