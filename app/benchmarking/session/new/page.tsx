import React from 'react';
import { BenchmarkNewSessionFlow } from '@/app/benchmarking/components/benchmarkNewSessionFlow';

type PageProps = {
  searchParams: {
    skip_topics: string;
  };
};

export default function BenchmarkNewSessionFlowPage(props: PageProps) {
  const { searchParams } = props;
  const isSkipTopics = searchParams.skip_topics === 'true';
  return <BenchmarkNewSessionFlow threeStepsFlow={isSkipTopics} />;
}
