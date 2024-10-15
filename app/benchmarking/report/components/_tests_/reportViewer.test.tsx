import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportViewer } from '@/app/benchmarking/report/components/reportViewer';
import { mockBenchmarkResultWithMLCCookbook } from './mocks/mockBenchmarkResultWithMLCCookbook';
import { mockBenchmarkResultWithNullRecipeEvaluation } from './mocks/mockBenchmarkResultWithNullRecipeEvaluation';
import { mockBenchmarkResultWithStandardCookbooks } from './mocks/mockBenchmarkResultWithStandardCookbooks';
import {
  mockCookbookCategoryLabels,
  mockCookbookCategoryLabelsStandard,
} from './mocks/mockCookbookCategoryLabels';
import {
  mockCookbooksInReport,
  mockCookbooksInReportStandard,
} from './mocks/mockCookbooksInReport';
import { mockEndpointsInReport } from './mocks/mockEndpointsInReport';
import { mockRecipes } from './mocks/mockRecipes';
import { mockRunnerNameAndDescription } from './mocks/mockRunnerNameAndDescription';

it('renders report containing standard cookbook results and MLCommons AISafetycookbook results', async () => {
  let container: HTMLElement | undefined = undefined;
  await act(() => {
    const result = render(
      <ReportViewer
        benchmarkResult={mockBenchmarkResultWithMLCCookbook}
        runnerNameAndDescription={mockRunnerNameAndDescription}
        cookbookCategoryLabels={mockCookbookCategoryLabels}
        cookbooksInReport={mockCookbooksInReport}
        recipes={mockRecipes}
        endpoints={mockEndpointsInReport}
      />
    );
    container = result.container;
  });

  expect(
    screen.getByText(mockRunnerNameAndDescription.name)
  ).toBeInTheDocument();
  expect(
    screen.getByText(mockBenchmarkResultWithMLCCookbook.metadata.endpoints[0])
  ).toBeInTheDocument();
  expect(screen.getByText(mockEndpointsInReport[0].name)).toBeInTheDocument();
  expect(screen.getByText(/section 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Safety Baseline v0.5/i)).toBeInTheDocument();
  for (const cookbook of mockCookbooksInReport) {
    expect(screen.queryAllByText(cookbook.name)).toHaveLength(2);
  }
  expect(screen.queryAllByRole('label', { name: /^B$/ })).toHaveLength(3); // 1 in ratings description, 1 overall grade and 1 in the recipe grade
  expect(screen.queryAllByRole('label', { name: /^L$/ })).toHaveLength(9); // 5 in section 1 (1 overall, 3 mlc recipes, 1 in inteprertation description), 4 in cookbook score card (1 overall, 3 mlc recipes)
  expect(
    (container as unknown as HTMLElement).querySelector('#report-content')
  ).toMatchSnapshot();

  const endpointDropdownItem = screen.queryAllByText(
    mockBenchmarkResultWithMLCCookbook.metadata.endpoints[0]
  )[0];
  await userEvent.click(endpointDropdownItem);
  await userEvent.click(
    screen.getByText(mockBenchmarkResultWithMLCCookbook.metadata.endpoints[1])
  );
  expect(
    screen.getByText(mockBenchmarkResultWithMLCCookbook.metadata.endpoints[1])
  ).toBeInTheDocument();
  expect(screen.getByText(mockEndpointsInReport[1].name)).toBeInTheDocument();
  expect(screen.queryAllByRole('label', { name: /^C$/ })).toHaveLength(3); // 1 in ratings description, 1 overall grade and 1 in the recipe grade
  expect(screen.queryAllByRole('label', { name: /^L$/ })).toHaveLength(17); // All mlc grades are mocked as L. 17 of them
});

it('renders report containing standard cookbook results only', async () => {
  await act(() => {
    render(
      <ReportViewer
        benchmarkResult={mockBenchmarkResultWithStandardCookbooks}
        runnerNameAndDescription={mockRunnerNameAndDescription}
        cookbookCategoryLabels={mockCookbookCategoryLabelsStandard}
        cookbooksInReport={mockCookbooksInReportStandard}
        recipes={mockRecipes}
        endpoints={mockEndpointsInReport}
      />
    );
  });

  expect(screen.queryByText(/section 1/i)).toBeNull();
  for (const cookbook of mockCookbooksInReportStandard) {
    expect(screen.queryAllByText(cookbook.name)).toHaveLength(2);
  }
  expect(screen.queryAllByRole('label', { name: /^A$/ })).toHaveLength(3);
  expect(screen.queryAllByRole('label', { name: /^B$/ })).toHaveLength(3);
  expect(screen.queryAllByRole('label', { name: /^C$/ })).toHaveLength(1);
  expect(screen.queryAllByRole('label', { name: /^D$/ })).toHaveLength(1);
  const endpointDropdownItem = screen.queryAllByText(
    mockBenchmarkResultWithStandardCookbooks.metadata.endpoints[0]
  )[0];
  await userEvent.click(endpointDropdownItem);
  await userEvent.click(
    screen.getByText(
      mockBenchmarkResultWithStandardCookbooks.metadata.endpoints[1]
    )
  );
  expect(screen.queryAllByRole('label', { name: /^A$/ })).toHaveLength(1);
  expect(screen.queryAllByRole('label', { name: /^B$/ })).toHaveLength(1);
  expect(screen.queryAllByRole('label', { name: /^C$/ })).toHaveLength(3);
  expect(screen.queryAllByRole('label', { name: /^D$/ })).toHaveLength(3);
});

it('should show raw scores when recipe evaluation is null', async () => {
  await act(() => {
    render(
      <ReportViewer
        benchmarkResult={mockBenchmarkResultWithNullRecipeEvaluation}
        runnerNameAndDescription={mockRunnerNameAndDescription}
        cookbookCategoryLabels={mockCookbookCategoryLabelsStandard}
        cookbooksInReport={mockCookbooksInReportStandard}
        recipes={mockRecipes}
        endpoints={mockEndpointsInReport}
      />
    );
  });

  expect(screen.getByText(/Raw Scores/i)).toBeInTheDocument();
  expect(
    screen.queryAllByText(
      /\[ \{ "accuracy": 100, "grading_criteria": \{ "accuracy": 100 \} \} \]/i
    )
  ).toHaveLength(5);
  expect(
    screen.queryAllByText(
      /\[ \{ "accuracy": 0, "grading_criteria": \{ "accuracy": 0 \} \} \]/i
    )
  ).toHaveLength(2);
});
