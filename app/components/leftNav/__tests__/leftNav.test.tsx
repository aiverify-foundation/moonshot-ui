import { render, fireEvent } from '@testing-library/react';
import LeftNav from '..';

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
      onClick,
      onMouseEnter,
      onMouseLeave,
    }: {
      children: React.ReactNode;
      href: string;
      onClick: React.MouseEventHandler<HTMLAnchorElement>;
      onMouseEnter: React.MouseEventHandler<HTMLAnchorElement>;
      onMouseLeave: React.MouseEventHandler<HTMLAnchorElement>;
    }) => {
      return (
        <a
          href={href}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          {children}
        </a>
      );
    },
  };
});

test('renders leftNav', () => {
  const view = render(<LeftNav />);
  const links = view.getAllByRole('link');
  expect(links.length).toEqual(5);
  const endpointLink = links.find(
    (l) => l.getAttribute('href') === '/endpoints'
  );
  const benchmarkLink = links.find(
    (l) => l.getAttribute('href') === '/benchmarking'
  );
  const redteamLink = links.find(
    (l) => l.getAttribute('href') === '/redteaming'
  );
  const historyLink = links.find((l) => l.getAttribute('href') === '/history');
  const utilitiesLink = links.find(
    (l) => l.getAttribute('href') === '/utilities'
  );
  expect(endpointLink).toBeInTheDocument();
  expect(benchmarkLink).toBeInTheDocument();
  expect(redteamLink).toBeInTheDocument();
  expect(historyLink).toBeInTheDocument();
  expect(utilitiesLink).toBeInTheDocument();

  fireEvent.mouseEnter(endpointLink as HTMLAnchorElement);
  expect(endpointLink).toHaveTextContent('model endpoints');
  fireEvent.mouseEnter(benchmarkLink as HTMLAnchorElement);
  expect(benchmarkLink).toHaveTextContent('benchmarking');
  fireEvent.mouseEnter(redteamLink as HTMLAnchorElement);
  expect(redteamLink).toHaveTextContent('red teaming');
  fireEvent.mouseEnter(historyLink as HTMLAnchorElement);
  expect(historyLink).toHaveTextContent('history');
  fireEvent.mouseEnter(utilitiesLink as HTMLAnchorElement);
  expect(utilitiesLink).toHaveTextContent('utils');
});
