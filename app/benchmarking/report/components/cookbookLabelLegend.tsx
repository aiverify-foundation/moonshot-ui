import React from 'react';

type CookbookLabelLegendProps = {
  resultId: string;
  pageBreakBefore?: boolean;
};

export function CookbookLabelLegend(props: CookbookLabelLegendProps) {
  const { resultId, pageBreakBefore } = props;
  const downloadUrl = `/api/v1/benchmarks/results/${resultId}?download=true`;

  return (
    <section
      className={`text-[0.9rem] px-6 text-reportText ${
        pageBreakBefore ? 'break-before-page' : ''
      }`}>
      <section className="bg-[#202020] rounded-lg p-6">
        <h3 className="text-white pb-6">Legend</h3>
        <p className="pb-6">
          <span className="font-bold text-fuchsia-400 ">Q - Quality</span>
          &nbsp;evaluates the model&apos;s ability to consistently produce
          content that meets general correctness and application-specific
          standards.
        </p>
        <p className="pb-6">
          <span className="font-bold text-fuchsia-400 ">C - Capability</span>
          &nbsp;assesses the AI model&apos;s ability to perform within the
          context of the unique requirements and challenges of a particular
          domain or task.
        </p>
        <p className="pb-6">
          <span className="font-bold text-fuchsia-400 ">
            T - Trust & Safety
          </span>
          &nbsp;addresses the reliability, ethical considerations, and inherent
          risks of the AI model. It also examines potential scenarios where the
          AI system could be used maliciously or unethically.
        </p>
      </section>

      <p
        className="p-6"
        data-download="hide">
        This report summarises the results for the benchmark tests ran on the
        endpoint. For the full detailed test results, &nbsp;
        <a
          className="text-fuchsia-400"
          href={downloadUrl}>
          Download the JSON file here
        </a>
        .
      </p>
    </section>
  );
}
