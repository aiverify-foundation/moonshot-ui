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
    | 'CLOSE_REQUIRED_ENDPOINTS_MODAL'
    | 'SHOW_SURFACE_OVERLAY'
    | 'HIDE_SURFACE_OVERLAY';
  cookbooksLength?: number;
  modelsLength?: number;
  modelToEdit?: LLMEndpoint;
  requiredEndpointsTokensFilled?: boolean;
  hasAdditionalRequirements?: boolean;
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
  showSurfaceOverlay?: boolean;
};

export const flowSteps = ['Connect Endpoint', 'Select Tests', 'Run'];
export const flowStepsWithConfigRequirements = [
  'Connect Endpoint',
  'Select Tests',
  'Configure Requirements',
  'Run',
];

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
  showSurfaceOverlay: false,
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
          stepIndex: state.stepIndex + 1,
          view: BenchmarkNewSessionViews.COOKBOOKS_SELECTION,
          requiredEndpoints: undefined,
          hideNextBtn: false,
          disableNextBtn: action.cookbooksLength === 0,
          hidePrevBtn: false,
          disablePrevBtn: false,
          showSurfaceOverlay: false,
        };
      }
      if (state.view === BenchmarkNewSessionViews.COOKBOOKS_SELECTION) {
        return {
          ...state,
          steps: action.hasAdditionalRequirements
            ? flowStepsWithConfigRequirements
            : flowSteps,
          stepIndex: state.stepIndex + 1,
          view: action.hasAdditionalRequirements
            ? BenchmarkNewSessionViews.CONFIGURE_ADDITIONAL_REQUIREMENTS
            : BenchmarkNewSessionViews.BENCHMARK_RUN_FORM,
          hidePrevBtn: false,
          hideNextBtn: action.hasAdditionalRequirements ? false : true,
          disablePrevBtn: false,
          disableNextBtn: action.hasAdditionalRequirements ? false : true,
          showSurfaceOverlay: false,
        };
      }
      if (
        state.view ===
        BenchmarkNewSessionViews.CONFIGURE_ADDITIONAL_REQUIREMENTS
      ) {
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
          showSurfaceOverlay: false,
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
          showSurfaceOverlay: false,
        };
      }
      if (
        state.view ===
        BenchmarkNewSessionViews.CONFIGURE_ADDITIONAL_REQUIREMENTS
      ) {
        return {
          ...state,
          stepIndex: state.stepIndex - 1,
          view: BenchmarkNewSessionViews.COOKBOOKS_SELECTION,
          hideNextBtn: false,
          hidePrevBtn: false,
          disableNextBtn: false,
          disablePrevBtn: false,
          showSurfaceOverlay: false,
        };
      }
    case 'COOKBOOK_SELECTION_CLICK':
      return {
        ...state,
        steps: action.hasAdditionalRequirements
          ? flowStepsWithConfigRequirements
          : flowSteps,
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
      const targetView =
        state.stepIndex === 0
          ? BenchmarkNewSessionViews.ENDPOINTS_SELECTION
          : BenchmarkNewSessionViews.CONFIGURE_ADDITIONAL_REQUIREMENTS;
      return {
        ...state,
        view: targetView,
        modelToEdit: undefined,
        hideNextBtn: false,
        hidePrevBtn: state.stepIndex === 0 ? true : false,
        disableNextBtn: action.modelsLength === 0,
        disablePrevBtn: state.stepIndex === 0 ? true : false,
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
    case 'SHOW_SURFACE_OVERLAY':
      return {
        ...state,
        showSurfaceOverlay: true,
      };
    case 'HIDE_SURFACE_OVERLAY':
      return {
        ...state,
        showSurfaceOverlay: false,
      };
    default:
      return state;
  }
}
