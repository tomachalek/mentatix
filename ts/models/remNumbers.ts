import {ActionDispatcher, Action, StatelessModel, SideEffectHandler} from 'kombo';
import {Actions as AppActions, PanelNames} from '../models/app';
import {PaneStatus} from '../models/common';

export interface RememberNumbersState {
    status:PaneStatus;
    pattern:string;
    userAnswer:string;
    lastEval:boolean;
}

export enum Actions {
    SET_USER_ANSWER = 'REMNM_SET_USER_ANSWER',
    SUBMIT_USER_ANSWER = 'REMNM_SUBMIT_USER_ANSWER'
}

export class RememberNumbers extends StatelessModel<RememberNumbersState> {

    constructor(dispatcher:ActionDispatcher) {
        super(
            dispatcher,
            {
                pattern: '',
                userAnswer: '',
                status: PaneStatus.DISABLED,
                lastEval: false
            },
            (state, action, dispatch) => {
                switch (action.type) {
                    case AppActions.SET_ACTIVE_PANEL:
                        dispatch({
                            type: AppActions.CONFIGURE,
                            payload: {
                                timeRemaining: 4
                            }
                        });
                    break;
                    case Actions.SUBMIT_USER_ANSWER:
                        dispatch({
                            type: AppActions.ADD_ANSWER,
                            payload: {
                                value: state.lastEval
                            }
                        });
                    break;
                }
            }
        );
    }

    generatePhoneLikeNum(numTriplets:number):string {
        const ans = [];
        for (let i = 0; i < numTriplets; i++) {
            ans.push((Math.random() * 1000).toFixed());
        }
        return ans.join('-');
    }

    reduce(state:RememberNumbersState, action:Action):RememberNumbersState {
        const newState = this.copyState(state);
        switch (action.type) {
            case AppActions.SET_ACTIVE_PANEL:
                newState.status = action.payload['value'] === PanelNames.REMEMBER_NUMBERS ?
                    PaneStatus.PENDING : PaneStatus.DISABLED;
            break;
            case AppActions.START_TASK:
                if (newState.status === PaneStatus.PENDING) {
                    newState.status = PaneStatus.PLAYING;
                    newState.pattern = this.generatePhoneLikeNum(2);
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
            case Actions.SUBMIT_USER_ANSWER:
                newState.lastEval = newState.userAnswer === newState.pattern;
                newState.status = PaneStatus.PENDING;
            break;
            default:
                return state;
        }
        return newState;
    }

}