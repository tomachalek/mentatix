import { StatelessModel } from "kombo";

export enum PaneStatus {
    DISABLED = 'disabled',
    PENDING = 'pending',
    PLAYING = 'playing',
    WAITING_ANSWER = 'waiting_answer'
}


export interface GeneralPaneState {
    status:PaneStatus;
    lastEval:boolean;
    optionsVisible:boolean;
}


export enum Actions {
    SET_ACTIVE_PANEL = 'APP_SET_ACTIVE_PANEL',
    START_TASK = 'APP_START_TIMER',
    STOP_TIMER = 'APP_STOP_TIMER',
    DECREASE_TIMER = 'APP_DECREASE_TIMER',
    CONFIGURE = 'APP_CONFIGURE',
    ADD_ANSWER = 'APP_ADD_ANSWER',
    SUBMIT_USER_ANSWER = 'APP_SUBMIT_USER_ANSWER',
    SHOW_TASK_OPTIONS = 'APP_SHOW_TASK_OPTIONS',
    HIDE_TASK_OPTIONS = 'APP_HIDE_TASK_OPTIONS',
}


export abstract class GeneralTaskModel<T extends GeneralPaneState> extends StatelessModel<T> {

    isVisible(state:T):boolean {
        return state.status !== PaneStatus.DISABLED;
    }

    isPending(state:T):boolean {
        return state.status === PaneStatus.PENDING;
    }

}