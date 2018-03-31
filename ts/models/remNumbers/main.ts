import {ActionDispatcher, Action, SEDispatcher} from 'kombo';
import {PanelNames} from '../app';
import {PaneStatus, GeneralTaskModel, Actions as AppActions} from '../common';

export interface RememberNumbersState {
    status:PaneStatus;
    pattern:string;
    userAnswer:string;
    lastEval:boolean|null;
    optionsVisible:boolean;
    optionsTimeRemaining:string;
    optionsPatternLength:string;
}

export enum Actions {
    SET_USER_ANSWER = 'REMNM_SET_USER_ANSWER',
    SET_OPTIONS_TIME_REMAINING = 'REMNM_SET_OPTIONS_TIME_REMAINING',
    SET_OPTIONS_PATTERN_LENGTH = 'REMNM_SET_OPTIONS_PATTERN_LENGTH'
}

export class RememberNumbers extends GeneralTaskModel<RememberNumbersState> {

    constructor(dispatcher:ActionDispatcher) {
        super(
            dispatcher,
            {
                pattern: '',
                userAnswer: '',
                status: PaneStatus.PENDING,
                lastEval: false,
                optionsVisible: false,
                optionsTimeRemaining: '4',
                optionsPatternLength: '6'
            }
        );
    }

    generatePhoneLikeNum(state:RememberNumbersState):string {
        const numItems = Number(state.optionsPatternLength);
        const ans = [];
        for (let i = 0; i < numItems; i++) {
            ans.push((Math.random() * 1000).toFixed().substr(0, 1));
            if ((i + 1) % 3 === 0 && i < numItems - 1) {
                ans.push('-');
            }
        }
        return ans.join('');
    }

    reduce(state:RememberNumbersState, action:Action):RememberNumbersState {
        const newState = this.copyState(state);
        switch (action.type) {
            case AppActions.SET_ACTIVE_PANEL:
                if (action.payload['value'] === PanelNames.REMEMBER_NUMBERS) {
                    newState.status = PaneStatus.PENDING;

                } else {
                    this.suspend((action) => {
                        return action.type === AppActions.SET_ACTIVE_PANEL &&
                                action.payload['value'] === PanelNames.REMEMBER_NUMBERS;
                    });
                }
            break;
            case AppActions.SHOW_TASK_OPTIONS:
                newState.optionsVisible = true;
            break;
            case AppActions.HIDE_TASK_OPTIONS:
                newState.optionsVisible = false;
            break;
            case AppActions.START_TASK:
                if (this.isPending(newState)) {
                    newState.lastEval = null;
                    newState.status = PaneStatus.PLAYING;
                    newState.pattern = this.generatePhoneLikeNum(newState);
                    newState.userAnswer = '';
                }
            break;
            case AppActions.STOP_TIMER:
                newState.status = PaneStatus.WAITING_ANSWER;
            break;
            case Actions.SET_USER_ANSWER: {
                newState.userAnswer = action.payload['value'];
                const items = action.payload['value'].split('-');
                if (items[items.length - 1].length === 3 && newState.userAnswer.length < newState.pattern.length) {
                    newState.userAnswer += '-';
                }
            }
            break;
            case AppActions.SUBMIT_USER_ANSWER:
                newState.lastEval = newState.userAnswer === newState.pattern;
                newState.status = PaneStatus.PENDING;
            break;
            case Actions.SET_OPTIONS_TIME_REMAINING:
                newState.optionsTimeRemaining = action.payload['value'];
            break;
            case Actions.SET_OPTIONS_PATTERN_LENGTH:
                newState.optionsPatternLength = action.payload['value'];
            break;
            default:
                return state;
        }
        return newState;
    }

    sideEffects(state:RememberNumbersState, action:Action, dispatch:SEDispatcher):void {
        switch (action.type) {
            case AppActions.SET_ACTIVE_PANEL:
                if (this.isVisible(state)) {
                    dispatch({
                        type: AppActions.CONFIGURE,
                        payload: {
                            timeRemaining: Number(state.optionsTimeRemaining)
                        }
                    });
                }
            break;
            case AppActions.SUBMIT_USER_ANSWER:
                dispatch({
                    type: AppActions.ADD_ANSWER,
                    payload: {
                        value: state.lastEval
                    }
                });
            case AppActions.HIDE_TASK_OPTIONS:
                dispatch({
                    type: AppActions.CONFIGURE,
                    payload: {
                        timeRemaining: Number(state.optionsTimeRemaining)
                    }
                });
            break;
        }
    }

}