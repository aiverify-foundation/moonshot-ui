import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAllBookmarks } from '@/actions/getAllBookmarks';
import { BookmarksPanel } from '@/app/redteaming/(fullscreen)/components/bookmarksPanel';

jest.mock('@/actions/getAllBookmarks');

const mockBookmarks = [
  {
    name: 'Bookmark 1',
    prompt: 'Prompt 1',
    prepared_prompt: 'Prepared Prompt 1',
    response: 'Response 1',
    metric: 'Metric 1',
    attack_module: 'Attack Module 1',
    context_strategy: 'Context Strategy 1',
    prompt_template: 'Prompt Template 1',
  },
  {
    name: 'Bookmark 2',
    prompt: 'Prompt 2',
    prepared_prompt: 'Prepared Prompt 2',
    response: 'Response 2',
    metric: 'Metric 2',
    attack_module: 'Attack Module 2',
    context_strategy: 'Context Strategy 2',
    prompt_template: 'Prompt Template 2',
  },
  {
    name: 'Bookmark 3',
    prompt: 'Prompt 3',
    prepared_prompt: 'Prepared Prompt 3',
    response: 'Response 3',
    metric: 'Metric 3',
    attack_module: 'Attack Module 3',
    context_strategy: 'Context Strategy 3',
    prompt_template: 'Prompt Template 3',
  },
];

describe('BookmarksPanel', () => {
  const mockUseButtonHandler = jest.fn();

  beforeAll(() => {
    (getAllBookmarks as jest.Mock).mockResolvedValue({
      status: 'success',
      data: mockBookmarks,
    });
  });

  it('shows first bookmark details by default', async () => {
    render(
      <BookmarksPanel
        bottom={0}
        left={0}
        disabled={false}
        onUseBtnClick={mockUseButtonHandler}
      />
    );
    await userEvent.click(
      screen.getByRole('button', { name: /bookmarked prompts/i })
    );
    expect(screen.queryAllByText(mockBookmarks[0].name)).toHaveLength(2);
    expect(screen.getByText(mockBookmarks[1].name)).toBeInTheDocument();
    expect(screen.getByText(mockBookmarks[2].name)).toBeInTheDocument();

    await userEvent.click(screen.getByText(mockBookmarks[2].name));
    expect(screen.queryAllByText(mockBookmarks[0].name)).toHaveLength(1);
    expect(screen.queryAllByText(mockBookmarks[1].name)).toHaveLength(1);
    expect(screen.queryAllByText(mockBookmarks[2].name)).toHaveLength(2);

    await userEvent.click(screen.getByRole('button', { name: /use/i }));
    expect(mockUseButtonHandler).toHaveBeenCalledWith(
      mockBookmarks[2].prepared_prompt
    );
  });

  it('filters bookmarks by name', async () => {
    render(
      <BookmarksPanel
        bottom={0}
        left={0}
        disabled={false}
        onUseBtnClick={mockUseButtonHandler}
      />
    );
    await userEvent.click(
      screen.getByRole('button', { name: /bookmarked prompts/i })
    );
    const searchInput = screen.getByPlaceholderText('Search by name');
    await userEvent.type(searchInput, mockBookmarks[1].name.slice(-3));
    await userEvent.click(screen.getByText(mockBookmarks[1].name));
    expect(screen.queryAllByText(mockBookmarks[1].name)).toHaveLength(2);
    expect(screen.queryByText(mockBookmarks[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockBookmarks[2].name)).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /clear search/i })
    );

    expect(screen.queryByText(mockBookmarks[0].name)).toBeInTheDocument();
    expect(screen.queryAllByText(mockBookmarks[1].name)).toHaveLength(2);
    expect(screen.queryByText(mockBookmarks[2].name)).toBeInTheDocument();
  });
});
