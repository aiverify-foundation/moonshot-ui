import { GradingScale } from '@/app/views/benchmarking/types/benchmarkReportTypes';
import { gradeColors } from './gradeColors';

type RangedBarChartProps = {
  gradingScale: GradingScale;
  gradeValue: number;
};

function RangedBarChart(props: RangedBarChartProps) {
  const { gradingScale, gradeValue } = props;

  let cumulativeWidth = 0;
  let pointerPosition = 0;

  // Sort grades in descending order
  const sortedGrades = Object.entries(gradingScale).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  for (const [grade, range] of sortedGrades) {
    const widthPercentage = ((range[1] - range[0] + 1) / 100) * 100;
    if (gradeValue >= range[0] && gradeValue <= range[1]) {
      const positionInBar = (gradeValue - range[0]) / (range[1] - range[0] + 1);
      pointerPosition = cumulativeWidth + positionInBar * widthPercentage;
    }
    cumulativeWidth += widthPercentage;
  }

  return (
    <div className="relative flex w-full gap-2">
      <div
        className="absolute"
        style={{
          left: `${pointerPosition}%`,
          top: '-15px',
          transform: 'translateX(-50%)',
        }}>
        <div className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[12px] border-b-white" />
      </div>
      {sortedGrades.map(([grade, range]) => {
        const widthPercentage = ((range[1] - range[0] + 1) / 100) * 100;
        return (
          <div
            className="flex flex-col justify-center"
            key={grade.toString()}
            style={{
              width: `${widthPercentage}%`,
            }}>
            <div
              className="rounded-sm h-4 w-full"
              style={{
                backgroundColor: gradeColors[grade as keyof typeof gradeColors],
              }}
            />
            <p className="text-center font-semibold">{grade}</p>
            <p className="text-center">
              {range[0]} - {range[1]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export { RangedBarChart };
