import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { PromptTemplatesList } from '@/app/utilities/prompt-templates/promptTemplatesList';

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

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockGetParam: jest.Mock = jest.fn();

const mockPromptTemplates: PromptTemplate[] = [
  {
    name: 'Template 1',
    description: 'Description for Template 1',
    template: 'Template content 1',
  },
  {
    name: 'Template 2',
    description: 'Description for Template 2',
    template: 'Template content 2',
  },
  {
    name: 'Template 3',
    description: 'Description for Template 3',
    template: 'Template content 3',
  },
];

it('renders PromptTemplatesList', async () => {
  (useSearchParams as jest.Mock).mockImplementation(() => ({
    get: mockGetParam,
  }));
  mockGetParam.mockReturnValue(undefined);
  render(<PromptTemplatesList templates={mockPromptTemplates} />);

  expect(screen.queryAllByText(mockPromptTemplates[0].name)).toHaveLength(2);
  expect(screen.queryAllByText(mockPromptTemplates[1].name)).toHaveLength(1);

  await userEvent.click(screen.getByText(mockPromptTemplates[1].name));
  expect(screen.queryAllByText(mockPromptTemplates[0].name)).toHaveLength(1);
  expect(screen.queryAllByText(mockPromptTemplates[1].name)).toHaveLength(2);
});
