import * as Rx from '@reactivex/rxjs';
import * as Immutable from 'immutable';
import {ActionDispatcher, Action, StatelessModel, SideEffectHandler} from 'kombo';


export enum PanelNames {
    REMEMBER_NUMBERS = 'remember-numbers',
    SUM_NUMBERS = 'sum-numbers'
}

export enum Actions {
    SET_ACTIVE_PANEL = 'APP_SET_ACTIVE_PANEL',
    START_TASK = 'APP_START_TIMER',
    STOP_TIMER = 'APP_STOP_TIMER',
    DECREASE_TIMER = 'APP_DECREASE_TIMER',
    CONFIGURE = 'APP_CONFIGURE',
    ADD_ANSWER = 'APP_ADD_ANSWER'
}

export interface AppModelState {
    activePanel:PanelNames;
    timeRemaining:number;
    startTimeRemaining:number;
    answers:Immutable.List<boolean>;
}

export class ApplicationModel extends StatelessModel<AppModelState> {

    private timer:Rx.Observable<Rx.TimeInterval<number>>;

    constructor(dispatcher:ActionDispatcher) {
        super(
            dispatcher,
            {
                activePanel: PanelNames.REMEMBER_NUMBERS,
                timeRemaining: -1,
                startTimeRemaining: -1,
                answers: Immutable.List<boolean>()
            },
            (state, action, dispatch) => {
                switch (action.type) {
                    case Actions.START_TASK:
                        this.timer = Rx.Observable.interval(1000).timeInterval().take(state.startTimeRemaining);
                        this.timer.subscribe(
                            (x) => {
                                dispatch({
                                    type: Actions.DECREASE_TIMER
                                });
                            },
                            (err) => {
                                console.log('Error: ' + err);
                                // TODO
                            },
                            () => {
                                dispatch({
                                    type: Actions.STOP_TIMER
                                });
                            });
                    break;
                }
            }
        );
    }

    reduce(state:AppModelState, action:Action):AppModelState {
        const newState = this.copyState(state);
        switch (action.type) {
            case Actions.SET_ACTIVE_PANEL:
                newState.activePanel = action.payload['value']
            break;
            case Actions.START_TASK:
                newState.timeRemaining = newState.startTimeRemaining;
            break;
            case Actions.STOP_TIMER:
            break;
            case Actions.DECREASE_TIMER:
                newState.timeRemaining -= 1;
            break;
            case Actions.CONFIGURE:
                newState.startTimeRemaining = action.payload['timeRemaining'];
            break;
            case Actions.ADD_ANSWER:
                newState.answers = newState.answers.push(action.payload['value']);
            break;
        }
        return newState;
    }

}