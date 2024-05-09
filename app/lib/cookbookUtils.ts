export function calcTotalPromptsAndEstimatedTime(
  allCookbooks: Cookbook[],
  secondsPerPrompt = 10
) {
  let totalHours = 0;
  let totalMinutes = 0;
  let totalPrompts = 0;
  let estTotalPromptResponseTime = 0;
  if (allCookbooks && allCookbooks.length) {
    totalPrompts = allCookbooks.reduce((acc, curr) => {
      return acc + curr.total_prompt_in_cookbook || 0;
    }, 0);
    estTotalPromptResponseTime = totalPrompts * secondsPerPrompt;
    if (estTotalPromptResponseTime) {
      totalHours = Math.floor(estTotalPromptResponseTime / 3600);
      totalMinutes = Math.floor((estTotalPromptResponseTime % 3600) / 60);
    }
  }

  return {
    totalHours,
    totalMinutes,
    totalPrompts,
    estTotalPromptResponseTime,
  };
}
