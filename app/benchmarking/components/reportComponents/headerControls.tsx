import { useState } from 'react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { downloadHtmlReport } from '@/app/benchmarking/utils/reportDownloader';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput } from '@/app/components/selectInput';
import { colors } from '@/app/customColors';

type HeaderControlsProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  onEndpointChange: (endpointId: string) => void;
};

export function HeaderControls(props: HeaderControlsProps) {
  const { benchmarkResult, onEndpointChange } = props;
  const [selectedEndpointId, setSelectedEndpointId] = useState(
    benchmarkResult.metadata.endpoints[0]
  );
  const endpointOptions = benchmarkResult.metadata.endpoints.map(
    (endpoint) => ({
      label: endpoint,
      value: endpoint,
    })
  );

  function handleEndpointChange(endpointId: string) {
    setSelectedEndpointId(endpointId);
    onEndpointChange(endpointId);
  }

  return (
    <section className="flex w-full items-center mt-6">
      <div className="flex-1 flex gap-4 items-center">
        <h3 className="text-white text-[1rem]">Showing results for</h3>
        <SelectInput
          name="endpoint"
          options={endpointOptions}
          value={selectedEndpointId}
          onChange={handleEndpointChange}
          style={{ marginBottom: 0, width: 400 }}
        />
      </div>

      <Button
        mode={ButtonType.OUTLINE}
        text="Download HTML Report"
        onClick={() => downloadHtmlReport(benchmarkResult.metadata.id)}
        hoverBtnColor={colors.moongray[800]}
      />
    </section>
  );
}
