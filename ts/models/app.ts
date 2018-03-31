import * as Rx from '@reactivex/rxjs';
import * as Immutable from 'immutable';
import {ActionDispatcher, Action, StatefulModel, SEDispatcher} from 'kombo';
import {Actions} from './common';


export enum PanelNames {
    REMEMBER_NUMBERS = 'remember-numbers',
    SUM_NUMBERS = 'sum-numbers',
    RESULTS = 'results'
}

export interface AppModelState {
    activePanel:PanelNames;
    timeRemaining:number;
    startTimeRemaining:number;
    answers:Immutable.List<boolean>;
    showLastAnswer:boolean;
}

export class ApplicationModel extends StatefulModel<AppModelState> {

    private timer:Rx.Observable<Rx.TimeInterval<number>>;

    constructor(dispatcher:ActionDispatcher) {
        super(
            dispatcher,
            {
                activePanel: PanelNames.REMEMBER_NUMBERS,
                timeRemaining: -1,
                startTimeRemaining: -1,
                answers: Immutable.List<boolean>(),
                showLastAnswer: false
            }
        );
    }

    onAction(action:Action):void {
        switch (action.type) {
            case Actions.SET_ACTIVE_PANEL:
                this.state.activePanel = action.payload['value']
                this.state.showLastAnswer = false;
                this.emitChange();
            break;
            case Actions.START_TASK:
                this.state.showLastAnswer = false;
                this.state.timeRemaining = this.state.startTimeRemaining;
                this.emitChange();
                this.timer = Rx.Observable.interval(1000).timeInterval().take(this.state.startTimeRemaining);
                this.timer.subscribe(
                    (x) => {
                        this.state.timeRemaining -= 1;
                        this.emitChange();
                    },
                    (err) => {
                        console.log('Error: ' + err);
                        // TODO
                    },
                    () => {
                        this.synchronize({
                            type: Actions.STOP_TIMER
                        });
                    });
            break;
            case Actions.STOP_TIMER:
            break;
            case Actions.CONFIGURE:
                this.state.startTimeRemaining = action.payload['timeRemaining'];
                this.emitChange();
            break;
            case Actions.ADD_ANSWER:
                this.state.answers = this.state.answers.push(action.payload['value']);
                this.emitChange();
            break;
            case Actions.SUBMIT_USER_ANSWER:
                this.state.showLastAnswer = true;
                this.emitChange();
            break;
        }
    }

    getState():AppModelState {
        return this.state;
    }

}