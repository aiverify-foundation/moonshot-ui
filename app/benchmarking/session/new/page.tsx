import React from 'react';
import { BenchmarkNewSessionFlow } from '@/app/benchmarking/components/benchmarkNewSessionFlow';

type PageProps = {
  searchParams: Promise<{
    skip_topics: string;
  }>;
};

export default async function BenchmarkNewSessionFlowPage(props: PageProps) {
  const { searchParams } = props;
  const { skip_topics } = await searchParams;
  const isSkipTopics = skip_topics === 'true';
  return <BenchmarkNewSessionFlow threeStepsFlow={isSkipTopics} />;
}
