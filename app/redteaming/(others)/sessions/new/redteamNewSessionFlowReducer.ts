import { RedteamingNewSessionViews } from './enums';

type Action = {
  type:
    | 'NEXT_BTN_CLICK'
    | 'PREV_BTN_CLICK'
    | 'SKIP_BTN_CLICK'
    | 'ENDPOINTS_SELECTION_CHANGE'
    | 'ATTACK_SELECTION_CHANGE';
  modelToEdit?: LLMEndpoint;
  modelsLength: number;
  attackSelected: boolean;
};

type FlowState = {
  steps: ['Connect Endpoint', 'Set Optional Utilities', 'Start Red Teaming'];
  stepIndex: number;
  view: RedteamingNewSessionViews;
  hideNextBtn: boolean;
  hidePrevBtn: boolean;
  disableNextBtn: boolean;
  disablePrevBtn: boolean;
  showSkipBtn: boolean;
  modelToEdit: LLMEndpoint | undefined;
};

export const initialState: FlowState = {
  steps: ['Connect Endpoint', 'Set Optional Utilities', 'Start Red Teaming'],
  stepIndex: 0,
  view: RedteamingNewSessionViews.ENDPOINTS_SELECTION,
  hideNextBtn: false,
  hidePrevBtn: true,
  disableNextBtn: true,
  disablePrevBtn: true,
  showSkipBtn: false,
  modelToEdit: undefined,
};

export function redteamNewSessionFlowReducer(
  state: FlowState,
  action: Action
): FlowState {
  switch (action.type) {
    case 'NEXT_BTN_CLICK':
      if (state.view === RedteamingNewSessionViews.ENDPOINTS_SELECTION) {
        return {
          ...state,
          view: RedteamingNewSessionViews.ATTACK_SELECTION,
          hidePrevBtn: false,
          hideNextBtn: !action.attackSelected,
          disablePrevBtn: false,
          disableNextBtn: !action.attackSelected,
          showSkipBtn: !action.attackSelected,
        };
      }
      if (state.view === RedteamingNewSessionViews.ATTACK_SELECTION) {
        return {
          ...state,
          view: RedteamingNewSessionViews.RUN_FORM,
          hidePrevBtn: false,
          hideNextBtn: true,
          disablePrevBtn: false,
          disableNextBtn: true,
          showSkipBtn: false,
        };
      }
    case 'PREV_BTN_CLICK':
      if (state.view === RedteamingNewSessionViews.ATTACK_SELECTION) {
        return {
          ...state,
          view: RedteamingNewSessionViews.ENDPOINTS_SELECTION,
          hidePrevBtn: true,
          hideNextBtn: false,
          disablePrevBtn: false,
          disableNextBtn: action.modelsLength === 0,
          showSkipBtn: false,
        };
      }
      if (state.view === RedteamingNewSessionViews.RUN_FORM) {
        return {
          ...state,
          view: RedteamingNewSessionViews.ATTACK_SELECTION,
          hidePrevBtn: false,
          hideNextBtn: !action.attackSelected,
          disablePrevBtn: false,
          disableNextBtn: !action.attackSelected,
          showSkipBtn: !action.attackSelected,
        };
      }
    case 'ENDPOINTS_SELECTION_CHANGE':
      return {
        ...state,
        disableNextBtn: action.modelsLength === 0,
      };
    case 'ATTACK_SELECTION_CHANGE':
      return {
        ...state,
        hideNextBtn: !action.attackSelected,
        disableNextBtn: !action.attackSelected,
        showSkipBtn: !action.attackSelected,
      };
    case 'SKIP_BTN_CLICK':
      if (state.view === RedteamingNewSessionViews.ATTACK_SELECTION) {
        return {
          ...state,
          view: RedteamingNewSessionViews.RUN_FORM,
          hidePrevBtn: true,
          hideNextBtn: false,
          disablePrevBtn: false,
          disableNextBtn: false,
          showSkipBtn: false,
        };
      }
    default:
      return state;
  }
}
