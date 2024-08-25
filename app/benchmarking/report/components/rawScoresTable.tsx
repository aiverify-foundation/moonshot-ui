import { RecipeResultPromptData } from '@/app/benchmarking/report/types/benchmarkReportTypes';

export function RawRecipeMetricsScoresTable({
  recipe,
  resultPromptData,
}: {
  recipe: Recipe;
  resultPromptData: RecipeResultPromptData[];
}) {
  return (
    <section className="mb-4">
      <p className="text-[0.8rem]">Raw Scores</p>
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
          <tbody>
            {resultPromptData.map((promptData) => {
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
                <tr key={promptData.dataset_id}>
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
