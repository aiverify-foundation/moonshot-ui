'use client';
import { useRouter } from 'next/navigation';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import BenchmarkReport from './benchmarkReport';

const options: SelectOption[] = [
  { label: 'Benchmark 1', value: 'benchmark1' },
  { label: 'Benchmark 2', value: 'benchmark2' },
  { label: 'Benchmark 3', value: 'benchmark3' },
];

function BenchmarkReportViewer() {
  const router = useRouter();

  return (
    <MainSectionSurface
      onCloseIconClick={() => router.push('/benchmarking')}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="flex flex-col items-center h-full">
        <div className="flex flex-col gap-5 w-full h-full">
          <section className="flex w-full items-center mt-6">
            <div className="flex-1 flex gap-4 items-center">
              <h3 className="text-white text-[1rem]">Showing results for</h3>
              <SelectInput
                name="endpoint"
                options={options}
                style={{ marginBottom: 0, width: 200 }}
              />
            </div>

            <Button
              mode={ButtonType.OUTLINE}
              text="Download HTML Report"
            />
          </section>
          <section className="flex-1 h-full border border-white rounded-lg overflow-hidden pr-[2px] py-[2px]">
            <div className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar">
              <BenchmarkReport />
            </div>
          </section>
        </div>
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkReportViewer };
