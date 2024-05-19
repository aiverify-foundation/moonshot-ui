import Link from 'next/link';
import { BenchmarkHomeMenu } from '@/app/views/benchmarking/benchmarkHomeMenu';
import BackToHomeButton from '@/app/views/shared-components/backToHomeButton/backToHomeButton';
import { colors } from '@/app/views/shared-components/customColors';

export default function BenchmarkingHomePage() {
  return (
    <>
      <header>
        <Link href="/">
          <BackToHomeButton colors={colors} />
        </Link>
      </header>
      <BenchmarkHomeMenu />
    </>
  );
}
