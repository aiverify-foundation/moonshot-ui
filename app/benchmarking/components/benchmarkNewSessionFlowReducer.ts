import { BenchmarkNewSessionViews } from './enums';

type Action = {
  type:
    | 'NEXT_BTN_CLICK'
    | 'PREV_BTN_CLICK'
    | 'CREATE_MODEL_CLICK'
    | 'EDIT_MODEL_CLICK'
    | 'CLOSE_MODEL_FORM'
    | 'COOKBOOK_SELECTION_CLICK'
    | 'MORE_COOKBOOKS_LINK_CLICK'
    | 'CLOSE_MORE_COOKBOOKS'
    | 'MODEL_SELECTION_CLICK'
    | 'CLOSE_REQUIRED_ENDPOINTS_MODAL';
  cookbooksLength?: number;
  modelsLength?: number;
  modelToEdit?: LLMEndpoint;
  requiredEndpoints?: string[];
  requiredEndpointsTokensFilled?: boolean;
};

type FlowState = {
  isThreeStepsFlow: boolean;
  steps: string[];
  stepIndex: number;
  view: BenchmarkNewSessionViews;
  hideNextBtn: boolean;
  hidePrevBtn: boolean;
  enableNextBtn: boolean;
  disableNextBtn: boolean;
  disablePrevBtn: boolean;
  modelToEdit: LLMEndpoint | undefined;
  requiredEndpoints?: string[];
};

const flowSteps = ['Your LLM', 'Recommended Tests', 'Connect Endpoint', 'Run'];
const threeStepsFlowSteps = ['Recommended Tests', 'Connect Endpoint', 'Run'];

export const initialState: FlowState = {
  isThreeStepsFlow: false,
  steps: flowSteps,
  stepIndex: 0,
  view: BenchmarkNewSessionViews.TOPICS_SELECTION,
  hideNextBtn: false,
  hidePrevBtn: true,
  enableNextBtn: false,
  disableNextBtn: false,
  disablePrevBtn: false,
  modelToEdit: undefined,
  requiredEndpoints: undefined,
};

export const threeStepsFlowInitialState: FlowState = {
  isThreeStepsFlow: true,
  steps: threeStepsFlowSteps,
  stepIndex: 0,
  view: BenchmarkNewSessionViews.COOKBOOKS_SELECTION,
  hideNextBtn: true,
  hidePrevBtn: true,
  enableNextBtn: false,
  disableNextBtn: false,
  disablePrevBtn: false,
  modelToEdit: undefined,
};
export function benchmarkNewSessionFlowReducer(
  state: FlowState,
  action: Action
): FlowState {
  switch (action.type) {
    case 'NEXT_BTN_CLICK':
      if (state.view === BenchmarkNewSessionViews.TOPICS_SELECTION) {
        return {
          ...state,
          stepIndex: state.stepIndex + 1,
          view: BenchmarkNewSessionViews.RECOMMENDED_TESTS,
          hidePrevBtn: false,
          disableNextBtn: action.cookbooksLength === 0,
        };
      }
      if (state.view === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
        return {
          ...state,
          stepIndex: state.stepIndex + 1,
          view: BenchmarkNewSessionViews.ENDPOINTS_SELECTION,
          hidePrevBtn: false,
          hideNextBtn: false,
          disablePrevBtn: false,
          disableNextBtn: action.modelsLength === 0,
        };
      }
      if (state.view === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
        const hideNextBtn =
          action.requiredEndpoints && action.requiredEndpoints.length > 0
            ? false
            : true;
        return {
          ...state,
          stepIndex: action.requiredEndpoints?.length
            ? state.stepIndex
            : state.stepIndex + 1,
          view: action.requiredEndpoints?.length
            ? BenchmarkNewSessionViews.ENDPOINTS_SELECTION
            : BenchmarkNewSessionViews.BENCHMARK_RUN_FORM,
          requiredEndpoints: action.requiredEndpoints,
          hideNextBtn: hideNextBtn,
          disableNextBtn: hideNextBtn,
        };
      }
      if (
        state.view === BenchmarkNewSessionViews.COOKBOOKS_SELECTION &&
        state.isThreeStepsFlow
      ) {
        return {
          ...state,
          stepIndex: state.stepIndex + 1,
          view: BenchmarkNewSessionViews.ENDPOINTS_SELECTION,
          hidePrevBtn: false,
          hideNextBtn: false,
          disableNextBtn: action.modelsLength === 0,
        };
      }
    case 'PREV_BTN_CLICK':
      if (state.view === BenchmarkNewSessionViews.BENCHMARK_RUN_FORM) {
        return {
          ...state,
          stepIndex: state.stepIndex - 1,
          view: BenchmarkNewSessionViews.ENDPOINTS_SELECTION,
          hidePrevBtn: false,
          hideNextBtn: false,
          disableNextBtn: action.modelsLength === 0,
        };
      }
      if (state.view === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
        return {
          ...state,
          stepIndex: state.stepIndex - 1,
          view: BenchmarkNewSessionViews.RECOMMENDED_TESTS,
          hidePrevBtn: state.isThreeStepsFlow ? true : false,
          disablePrevBtn: state.isThreeStepsFlow ? true : false,
          hideNextBtn: false,
          disableNextBtn: false,
        };
      }
      if (state.view === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
        return {
          ...state,
          stepIndex: state.stepIndex - 1,
          view: BenchmarkNewSessionViews.TOPICS_SELECTION,
          hidePrevBtn: true,
          disableNextBtn: action.cookbooksLength === 0,
        };
      }
    case 'COOKBOOK_SELECTION_CLICK':
      return {
        ...state,
        disableNextBtn: action.cookbooksLength === 0,
      };
    case 'MORE_COOKBOOKS_LINK_CLICK':
      return {
        ...state,
        view: BenchmarkNewSessionViews.COOKBOOKS_SELECTION,
        hideNextBtn: true,
        hidePrevBtn: true,
        disableNextBtn: true,
        disablePrevBtn: true,
      };
    case 'MODEL_SELECTION_CLICK':
      return {
        ...state,
        disableNextBtn: action.modelsLength === 0,
      };
    case 'CLOSE_MORE_COOKBOOKS':
      return {
        ...state,
        view: BenchmarkNewSessionViews.RECOMMENDED_TESTS,
        hideNextBtn: false,
        hidePrevBtn: state.isThreeStepsFlow ? true : false,
        disableNextBtn: false,
        disablePrevBtn: state.isThreeStepsFlow ? true : false,
      };
    case 'CREATE_MODEL_CLICK':
      return {
        ...state,
        view: BenchmarkNewSessionViews.NEW_ENDPOINT_FORM,
        hideNextBtn: true,
        hidePrevBtn: true,
        disableNextBtn: true,
        disablePrevBtn: true,
      };
    case 'EDIT_MODEL_CLICK':
      return {
        ...state,
        view: BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM,
        modelToEdit: action.modelToEdit,
        hideNextBtn: true,
        hidePrevBtn: true,
        disableNextBtn: true,
        disablePrevBtn: true,
      };
    case 'CLOSE_MODEL_FORM':
      return {
        ...state,
        view: BenchmarkNewSessionViews.ENDPOINTS_SELECTION,
        modelToEdit: undefined,
        hideNextBtn: false,
        hidePrevBtn: false,
        disableNextBtn: action.modelsLength === 0,
        disablePrevBtn: false,
      };
    case 'CLOSE_REQUIRED_ENDPOINTS_MODAL':
      if (action.requiredEndpointsTokensFilled) {
        return {
          ...state,
          stepIndex: state.stepIndex + 1,
          view: BenchmarkNewSessionViews.BENCHMARK_RUN_FORM,
          requiredEndpoints: undefined,
          disableNextBtn: true,
          hideNextBtn: true,
        };
      }
      return {
        ...state,
        requiredEndpoints: undefined,
        hideNextBtn: false,
        hidePrevBtn: false,
      };
  }
}
