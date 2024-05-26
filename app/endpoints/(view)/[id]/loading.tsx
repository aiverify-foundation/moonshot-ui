import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';

export default function Loading() {
  return (
    <div className="relative w-full h-full">
      <LoadingAnimation />
    </div>
  );
}
