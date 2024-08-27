'use client';
import html2pdf from 'jspdf-html2canvas';
import React from 'react';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { CookbookCategoryLabels } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { colors } from '@/app/customColors';
import { delay } from '@/app/lib/delay';
import { HeaderControls } from './headerControls';
import { Report } from './report';

type ReportViewerProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  runnerNameAndDescription: RunnerHeading;
  cookbookCategoryLabels: CookbookCategoryLabels;
  cookbooksInReport: Cookbook[];
  recipes: Recipe[];
};

function ReportViewer(props: ReportViewerProps) {
  const { benchmarkResult, runnerNameAndDescription } = props;
  const [isPrinting, setIsPrinting] = React.useState(() => false);
  const [selectedEndpointId, setSelectedEndpointId] = React.useState(
    benchmarkResult.metadata.endpoints[0]
  );
  const reportRef = React.useRef<HTMLDivElement>(null);

  function handleHeaderBtnClick() {
    setIsPrinting(true);
  }

  React.useEffect(() => {
    if (!isPrinting) return;
    async function printReport() {
      await delay(500);
      if (!reportRef.current) return;
      const report = reportRef.current;
      const pages = report.getElementsByClassName('pdf-page');
      html2pdf(pages, {
        jsPDF: {
          orientation: 'p',
          format: 'a4',
        },
        imageQuality: 1,
        imageType: 'png',
        margin: {
          top: 12,
          right: 12,
          bottom: 12,
          left: 12,
        },
        output: `report-${runnerNameAndDescription.name}-${selectedEndpointId}.pdf`,
        success: function (pdf) {
          pdf.save(this.output);
          setIsPrinting(false);
        },
      });
    }

    printReport();
  }, [isPrinting]);

  return (
    <MainSectionSurface
      closeLinkUrl="/benchmarking"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}
      contentHeight={isPrinting ? 'auto' : undefined}>
      <div className="relative flex flex-col gap-5 items-center h-full">
        <HeaderControls
          benchmarkResult={benchmarkResult}
          onEndpointChange={setSelectedEndpointId}
          onBtnClick={handleHeaderBtnClick}
        />
        <Report
          {...props}
          endpointId={selectedEndpointId}
          ref={reportRef}
          expanded={isPrinting}
          overflowY={isPrinting ? 'visible' : 'auto'}
        />
      </div>
    </MainSectionSurface>
  );
}

export { ReportViewer };
