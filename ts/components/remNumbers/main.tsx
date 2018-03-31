import * as React from 'react';
import { ActionDispatcher, ViewUtils, Bound } from 'kombo';
import {RememberNumbers, RememberNumbersState, Actions} from '../../models/remNumbers/main';
import {PaneStatus, Actions as AppActions} from '../../models/common';
import {init as optsViewInit} from './options';
import {CommonViews} from '../common';

export interface Views {
    Panel:React.ComponentClass<{}>;
}

export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils<CommonViews>;
    remNumberModel:RememberNumbers;
}

export function init({dispatcher, he, remNumberModel}:ViewsArgs):Views {

    const commonViews = he.getComponents();
    const optionsViews = optsViewInit({dispatcher, he});


    const AnswerButton:React.SFC<{}> = (props) => {

        const handleClick = () => {
            dispatcher.dispatch({
                type: AppActions.SUBMIT_USER_ANSWER
            });
        };

        return <button type="button" className="pure-button pure-button-primary AnswerButton"
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
                    type: AppActions.SUBMIT_USER_ANSWER
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
                    return <>
                        <p>Try to remember phone-like numbers</p>
                        <commonViews.StartButton />
                    </>;
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
                    {this.props.optionsVisible ?
                        <optionsViews.Options
                                optionsTimeRemaining={this.props.optionsTimeRemaining}
                                optionsPatternLength={this.props.optionsPatternLength} /> :
                        null
                    }
                    <div className="task-wrapper">
                        {this.renderContents()}
                    </div>
                </div>
            );
        }
    }


    return {
        Panel: Bound(Panel, remNumberModel)
    };

}