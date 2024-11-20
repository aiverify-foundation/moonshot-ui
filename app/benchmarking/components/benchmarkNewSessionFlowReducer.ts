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
  steps: string[];
  stepIndex: number;
  view: BenchmarkNewSessionViews;
  hideNextBtn: boolean;
  hidePrevBtn: boolean;
  disableNextBtn: boolean;
  disablePrevBtn: boolean;
  modelToEdit: LLMEndpoint | undefined;
  requiredEndpoints?: string[];
};

const flowSteps = ['Connect Endpoint', 'Select Tests', 'Run'];

export const initialState: FlowState = {
  steps: flowSteps,
  stepIndex: 0,
  view: BenchmarkNewSessionViews.ENDPOINTS_SELECTION,
  hideNextBtn: false,
  hidePrevBtn: true,
  disableNextBtn: true,
  disablePrevBtn: true,
  modelToEdit: undefined,
  requiredEndpoints: undefined,
};

export function benchmarkNewSessionFlowReducer(
  state: FlowState,
  action: Action
): FlowState {
  switch (action.type) {
    case 'NEXT_BTN_CLICK':
      if (state.view === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
        return {
          ...state,
          stepIndex: action.requiredEndpoints?.length
            ? state.stepIndex
            : state.stepIndex + 1,
          view: action.requiredEndpoints?.length
            ? BenchmarkNewSessionViews.ENDPOINTS_SELECTION
            : BenchmarkNewSessionViews.COOKBOOKS_SELECTION,
          requiredEndpoints: action.requiredEndpoints,
          hideNextBtn: false,
          disableNextBtn: action.cookbooksLength === 0,
          hidePrevBtn: false,
          disablePrevBtn: false,
        };
      }
      if (state.view === BenchmarkNewSessionViews.COOKBOOKS_SELECTION) {
        return {
          ...state,
          stepIndex: state.stepIndex + 1,
          view: BenchmarkNewSessionViews.BENCHMARK_RUN_FORM,
          hidePrevBtn: false,
          hideNextBtn: true,
          disablePrevBtn: false,
          disableNextBtn: true,
        };
      }
    case 'PREV_BTN_CLICK':
      if (state.view === BenchmarkNewSessionViews.BENCHMARK_RUN_FORM) {
        return {
          ...state,
          stepIndex: state.stepIndex - 1,
          view: BenchmarkNewSessionViews.COOKBOOKS_SELECTION,
          hidePrevBtn: false,
          hideNextBtn: false,
          disableNextBtn: false,
        };
      }
      if (state.view === BenchmarkNewSessionViews.COOKBOOKS_SELECTION) {
        return {
          ...state,
          stepIndex: state.stepIndex - 1,
          view: BenchmarkNewSessionViews.ENDPOINTS_SELECTION,
          hidePrevBtn: true,
          disablePrevBtn: true,
          hideNextBtn: false,
          disableNextBtn: false,
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
        hidePrevBtn: false,
        disableNextBtn: true,
        disablePrevBtn: false,
      };
    case 'MODEL_SELECTION_CLICK':
      return {
        ...state,
        disableNextBtn: action.modelsLength === 0,
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
    default:
      return state;
  }
}
