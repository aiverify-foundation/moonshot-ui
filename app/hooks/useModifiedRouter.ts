import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

export function useModifiedRouter(): AppRouterInstance {
  const router = useRouter();
  function push(path: string) {
    process.env.NEXT_PUBLIC_BASE_PATH
      ? router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}${path}`)
      : router.push(path);
  }
  return { ...router, push };
}
