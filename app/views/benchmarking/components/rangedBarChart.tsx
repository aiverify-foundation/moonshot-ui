import {
  GradingColors,
  GradingScale,
} from '@/app/views/benchmarking/types/benchmarkReportTypes';

type RangedBarChartProps = {
  gradingScale: GradingScale;
  gradeColors: GradingColors;
  gradeValue: number;
};

function RangedBarChart(props: RangedBarChartProps) {
  const { gradingScale, gradeValue, gradeColors } = props;

  let cumulativeWidth = 0;
  let pointerPosition = 0;

  // sort by range start number which is the value of tuple first index
  const sortedGrades = Object.entries(gradingScale).sort(
    (a, b) => a[1][0] - b[1][0]
  );

  for (const [_, range] of sortedGrades) {
    const widthPercentage = ((range[1] - range[0] + 1) / 100) * 100;
    if (gradeValue >= range[0] && gradeValue <= range[1]) {
      const positionInBar = (gradeValue - range[0]) / (range[1] - range[0] + 1);
      pointerPosition = cumulativeWidth + positionInBar * widthPercentage;
    }
    cumulativeWidth += widthPercentage;
  }

  return !sortedGrades.length ? (
    <div className="flex flex-col justify-center w-full">
      <div
        className="rounded-sm h-4 w-full"
        style={{
          backgroundColor: '#9A9A9A',
        }}
      />
      <p className="text-center">No tiered grading defined for this recipe</p>
    </div>
  ) : (
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
            <p className="text-center font-semibold mt-1">{grade}</p>
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
