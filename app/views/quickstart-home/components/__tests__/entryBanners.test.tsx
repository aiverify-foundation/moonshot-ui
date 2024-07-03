import { render, screen, fireEvent } from '@testing-library/react';
import { EntryBanners } from '@/app/views/quickstart-home/components/entryBanners';
import { resetBenchmarkCookbooks, resetBenchmarkModels } from '@/lib/redux';

jest.mock('@/lib/redux', () => ({
  // Mock  specific exports needed from this module
  useAppDispatch: () => jest.fn(),
  resetBenchmarkCookbooks: jest.fn(),
  resetBenchmarkModels: jest.fn(),
}));
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
      onClick,
    }: {
      children: React.ReactNode;
      href: string;
      onClick: React.MouseEventHandler<HTMLAnchorElement>;
    }) => {
      return (
        <a
          href={href}
          onClick={onClick}>
          {children}
        </a>
      );
    },
  };
});

test('renders entry banners', () => {
  render(<EntryBanners />);
  const startBenchmarkMain = screen.getByRole('button', {
    name: /get started/i,
  });
  const startRedTeam = screen.getByRole('link', {
    name: /discover new vulnerabilities start red teaming/i,
  });
  const startBenchmarkAlt = screen.getByRole('link', {
    name: /evaluate against standard tests run benchmarks/i,
  });
  const startCreateCookbook = screen.getByRole('link', {
    name: /create cookbooks select recipes/i,
  });
  fireEvent.click(startBenchmarkMain);
  fireEvent.click(startRedTeam);
  fireEvent.click(startBenchmarkAlt);
  fireEvent.click(startCreateCookbook);
  expect(resetBenchmarkCookbooks).toHaveBeenCalledTimes(3);
  expect(resetBenchmarkModels).toHaveBeenCalledTimes(3);
});
