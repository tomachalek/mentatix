import * as React from 'react';
import { ActionDispatcher, ViewUtils, Bound } from 'kombo';
import {SumNumbers, SumNumbersState, Actions} from '../../models/sumNumbers/main';
import {Actions as AppActions} from '../../models/common';
import {PaneStatus} from '../../models/common';
import {init as optsViewInit} from './options';
import {CommonViews} from '../common';

export interface Views {
    Panel:React.ComponentClass<{}>;
}

export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils<CommonViews>;
    sumNumberModel:SumNumbers;
}

export function init({dispatcher, he, sumNumberModel}:ViewsArgs):Views {

    const commonViews = he.getComponents();
    const optionsViews = optsViewInit(dispatcher, he);

    const AnswerButton:React.SFC<{}> = (props) => {

        const handleClick = () => {
            dispatcher.dispatch({
                type: AppActions.SUBMIT_USER_ANSWER
            });
        };

        return <button type="button" className="pure-button pure-button-primary AnswerButton"
                    onClick={handleClick}>Answer</button>;
    }


    const SumNumbersDisplay:React.SFC<{
        number1:Array<string>;
        number2:Array<string>;

    }> = (props) => {
        return (
            <table className="SumNumbersDisplay">
                <tbody>
                    <tr>
                        {props.number1.map((v, i) => <td key={`${i}:${v}`} >{v}</td>)}
                    </tr>
                    <tr>
                        {props.number2.map((v, i) => <td key={`${i}:${v}`} >{v}</td>)}
                    </tr>
                </tbody>
            </table>
        )
    };

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

        return (
            <input type="text" className="UserAnswerInput"
                    onChange={handleChange}
                    onKeyDown={handleKey}
                    ref={(ref) => ref ? ref.focus() : null} />
        );
    }


    class Panel extends React.PureComponent<SumNumbersState> {

    private renderContents() {
        switch (this.props.status) {
            case PaneStatus.PENDING:
                return <>
                    <p>Try to sum up numbers</p>
                    <commonViews.StartButton />
                </>;
            case PaneStatus.WAITING_ANSWER:
                return <>
                    <SumNumbersDisplay number1={this.props.number1}
                        number2={this.props.number2} />
                    <div>
                        <UserAnswerInput value={this.props.userAnswer} />
                        <AnswerButton />
                    </div>
                </>;
        }
    }


        render() {
            return (
                <div className="SumNumbersPanel">
                    {this.props.optionsVisible ?
                        <optionsViews.Options {...this.props} /> :
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
        Panel: Bound(Panel, sumNumberModel)
    };
}
