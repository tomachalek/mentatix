import * as React from 'react';
import { ActionDispatcher, ViewUtils, Bound } from 'kombo';
import {RememberNumbers, RememberNumbersState, Actions} from '../models/remNumbers';
import {Actions as AppActions} from '../models/app';
import {PaneStatus} from '../models/common';

export interface Views {
    Panel:React.ComponentClass<{}>;
}

export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils;
    remNumberModel:RememberNumbers;
}

export function init({dispatcher, he, remNumberModel}:ViewsArgs):Views {

    /**
     *
     * @param props
     */
    const StartButton:React.SFC<{}> = (props) => {

        const handleClick = () => {
            dispatcher.dispatch({
                type: AppActions.START_TASK
            });
        };

        return <button className="pure-button pure-button-primary"
                    onClick={handleClick}>Run</button>;
    }

    const AnswerButton:React.SFC<{}> = (props) => {

        const handleClick = () => {
            dispatcher.dispatch({
                type: Actions.SUBMIT_USER_ANSWER
            });
        };

        return <button type="button" className="pure-button pure-button-primary"
                    onClick={handleClick}>Answer</button>;
    }

    /**
     *
     * @param props
     */
    const PatternDisplay:React.SFC<{
        pattern:string;

    }> = (props) => {
        return (
            <span className="pattern">{props.pattern}</span>
        );
    }

    /**
     *
     * @param props
     */
    const UserAnswerInput:React.SFC<{
        value:string;

    }> = (props) => {

        const handleChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
            dispatcher.dispatch({
                type: Actions.SET_USER_ANSWER,
                payload: {value: evt.target.value}
            });
        };

        const handleKey = (evt:React.KeyboardEvent<{}>) => {
            if (evt.keyCode === 13) {
                dispatcher.dispatch({
                    type: Actions.SUBMIT_USER_ANSWER
                });
                evt.preventDefault();
                evt.stopPropagation();
            }
        };

        return <input ref={(ref) => ref ? ref.focus() : null}
                    className="UserAnswerInput" type="text" value={props.value}
                    onChange={handleChange}
                    onKeyDown={handleKey} />;
    };

    /**
     *
     */
    class Panel extends React.PureComponent<RememberNumbersState> {

        private renderContents() {
            switch (this.props.status) {
                case PaneStatus.PENDING:
                    return <StartButton />;
                case PaneStatus.PLAYING:
                    return <PatternDisplay pattern={this.props.pattern} />;
                case PaneStatus.WAITING_ANSWER:
                    return <>
                        <UserAnswerInput value={this.props.userAnswer} />
                        <AnswerButton />
                    </>;
            }
        }

        render() {
            return (
                <div className="RemNumbersPanel">
                    {this.renderContents()}
                </div>
            );
        }
    }


    return {
        Panel: Bound(Panel, remNumberModel)
    };

}