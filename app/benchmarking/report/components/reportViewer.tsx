'use client';
import html2pdfjs from 'html2pdf.js';
import React from 'react';
import { flushSync } from 'react-dom';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { isWebkit } from '@/app/benchmarking/utils/isWebkit';
import { HeaderControls } from './headerControls';
import { Report } from './report';

type ReportViewerProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  runnerNameAndDescription: RunnerHeading;
  cookbookCategoryLabels: CookbookCategoryLabels;
  cookbooksInReport: Cookbook[];
  recipes: Recipe[];
  endpoints: LLMEndpoint[];
};

const PrintingContext = React.createContext({
  prePrintingFlagEnabled: false,
});

function ReportViewer(props: ReportViewerProps) {
  const { benchmarkResult, runnerNameAndDescription, endpoints } = props;
  const [prePrintingFlagEnabled, setPrePrintingFlagEnabled] =
    React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedEndpointId, setSelectedEndpointId] = React.useState(
    benchmarkResult.metadata.endpoints[0]
  );
  const reportRef = React.useRef<HTMLDivElement>(null);

  const selectedEndpointName =
    endpoints.find((endpoint) => endpoint.id === selectedEndpointId)?.name ||
    selectedEndpointId;

  async function printReport() {
    if (!reportRef.current) return;
    const report = reportRef.current;
    await html2pdfjs(report, {
      margin: 0,
      filename: `report-${runnerNameAndDescription.name}-${selectedEndpointId}.pdf`,
      html2canvas: {
        scale: 2,
        y: 0,
        x: 0,
        scrollY: 0,
        scrollX: 0,
      },
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: { format: 'a4', orientation: 'portrait', unit: 'in' },
      pagebreak: { mode: 'css' },
    });
    setExpanded(false);
    setPrePrintingFlagEnabled(false);
  }

  function handleHeaderBtnClick() {
    flushSync(() => {
      setPrePrintingFlagEnabled(true);
    });
    flushSync(() => {
      setExpanded(true);
    });
    setTimeout(
      () => {
        printReport();
      },
      isWebkit() ? 1000 : 0
    );
  }

  return (
    <div className="relative flex flex-col gap-5 items-center h-full">
      <HeaderControls
        benchmarkResult={benchmarkResult}
        onEndpointChange={setSelectedEndpointId}
        onBtnClick={handleHeaderBtnClick}
        disabled={prePrintingFlagEnabled}
      />
      <PrintingContext.Provider value={{ prePrintingFlagEnabled }}>
        <Report
          {...props}
          endpointId={selectedEndpointId}
          endpointName={selectedEndpointName}
          ref={reportRef}
          expanded={expanded}
        />
      </PrintingContext.Provider>
    </div>
  );
}

export { ReportViewer, PrintingContext };
