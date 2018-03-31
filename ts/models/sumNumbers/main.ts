import {ActionDispatcher, Action, SEDispatcher} from 'kombo';
import {PanelNames} from '../app';
import {Actions as AppActions} from '../common';
import {PaneStatus, GeneralTaskModel} from '../common';

export interface SumNumbersState {
    status:PaneStatus;
    number1:Array<string>;
    number2:Array<string>;
    userAnswer:string;
    lastEval:boolean;
    optionsVisible:boolean;
    optionsNumDigits1:string;
    optionsNumDigits2:string;
}

export enum Actions {
    SET_USER_ANSWER = 'SUMNM_SET_USER_ANSWER',
    SET_OPTION_NUM_DIGITS = 'SUMNM_SET_OPTION_NUM_DIGITS'
}

export class SumNumbers extends GeneralTaskModel<SumNumbersState> {

    constructor(dispatcher:ActionDispatcher) {
        super(
            dispatcher,
            {
                status: PaneStatus.PENDING,
                number1: [],
                number2: [],
                userAnswer: '',
                lastEval: false,
                optionsVisible: false,
                optionsNumDigits1: '2',
                optionsNumDigits2: '2'
            }
        );
    }

    private generateNumber(size:number):Array<string> {
        const ans:Array<string> = [];
        for (let i = 0; i < size; i += 1) {
            ans.push((Math.floor(Math.random() * 10)).toFixed());
        }
        return ans;
    }

    private compareAnswer(state:SumNumbersState):void {
        const act = parseInt(state.number1.join('')) + parseInt(state.number2.join(''));
        state.lastEval =  act === parseInt(state.userAnswer);
    }

    reduce(state:SumNumbersState, action:Action):SumNumbersState {
        const newState = this.copyState(state);
        switch (action.type) {
            case AppActions.SET_ACTIVE_PANEL:
                if (action.payload['value'] === PanelNames.SUM_NUMBERS) {
                    newState.status = PaneStatus.PENDING;

                } else {
                    this.suspend((action) => {
                        return action.type === AppActions.SET_ACTIVE_PANEL &&
                                action.payload['value'] === PanelNames.SUM_NUMBERS;
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
                    newState.status = PaneStatus.WAITING_ANSWER;
                    newState.number1 = this.generateNumber(parseInt(newState.optionsNumDigits1));
                    newState.number2 = this.generateNumber(parseInt(newState.optionsNumDigits2));
                    newState.userAnswer = '';
                }
            break;
            case Actions.SET_USER_ANSWER:
                newState.userAnswer = action.payload['value'];
            break;
            case AppActions.SUBMIT_USER_ANSWER:
                this.compareAnswer(newState);
                newState.status = PaneStatus.PENDING;
            break;
            case Actions.SET_OPTION_NUM_DIGITS:
                newState.optionsNumDigits1
            break;
            default:
                return state;
        }
        return newState;
    }

    sideEffects(state:SumNumbersState, action:Action, dispatch:SEDispatcher):void {
        switch (action.type) {
            case AppActions.SET_ACTIVE_PANEL:
                if (this.isVisible(state)) {
                    dispatch({
                        type: AppActions.CONFIGURE,
                        payload: {
                            // TODO
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
            break;
            case AppActions.HIDE_TASK_OPTIONS:
                dispatch({
                    type: AppActions.CONFIGURE,
                    payload: {
                        // TODO
                    }
                });
            break;
        }
    }
}