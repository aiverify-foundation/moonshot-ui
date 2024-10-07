import React from 'react';
import { RecipeResultPromptData } from '@/app/benchmarking/report/types/benchmarkReportTypes';

export function RawRecipeMetricsScoresTable({
  recipe,
  resultPromptData,
}: {
  recipe: Recipe;
  resultPromptData: RecipeResultPromptData[];
}) {
  const tbodyRef = React.useRef<HTMLTableSectionElement>(null);
  const [rowCount, setRowCount] = React.useState(0);
  React.useLayoutEffect(() => {
    if (tbodyRef.current) {
      const actualTbodyHeight = tbodyRef.current.scrollHeight;
      const maxTbodyHeight = 950;
      const rowCount = tbodyRef.current.children.length;
      const rowHeight = actualTbodyHeight / rowCount;
      const maxRows = Math.floor(maxTbodyHeight / rowHeight);
      setRowCount(maxRows);
    }
  }, []);

  return (
    <section className="mb-4 break-before-page">
      <p className="text-[0.9rem] mb-1">Raw Scores</p>
      <div className="border border-moongray-700 rounded-lg">
        <table className="w-full text-sm text-left text-moongray-300">
          <thead className="text-xs text-moongray-300">
            <tr className="border-b border-moongray-700">
              <th
                scope="col"
                className="py-3 px-6 border-r border-moongray-700">
                Dataset
              </th>
              <th
                scope="col"
                className="py-3 px-6 border-r border-moongray-700">
                Prompt Template
              </th>
              <th
                scope="col"
                className="py-3 px-6 border-r border-moongray-700">
                Metric
              </th>
              <th
                scope="col"
                className="py-3 px-6">
                Score
              </th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {resultPromptData.map((promptData, idx) => {
              let stringifiedMetrics = '';
              try {
                stringifiedMetrics = JSON.stringify(
                  promptData.metrics,
                  null,
                  2
                );
              } catch (error) {
                console.log(error);
              }
              return (
                <tr
                  key={promptData.dataset_id}
                  className={
                    idx > 0 && idx % rowCount === 0 ? 'break-before-page' : ''
                  }>
                  <td className="py-3 px-6 border-r border-moongray-700 align-top">
                    {promptData.dataset_id}
                  </td>
                  <td className="py-3 px-6 border-r border-moongray-700 align-top">
                    {promptData.prompt_template_id}
                  </td>
                  <td className="py-3 px-6 border-r border-moongray-700 align-top">
                    {recipe.metrics.map((metricName, idx) => {
                      const name =
                        idx < promptData.metrics.length - 1
                          ? `${metricName}, `
                          : metricName;
                      return <span key={metricName}>{name}</span>;
                    })}
                  </td>
                  <td className="py-3 px-6">
                    <pre>{stringifiedMetrics}</pre>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
