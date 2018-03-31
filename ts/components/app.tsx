import * as React from 'react';
import * as Immutable from 'immutable';
import { ActionDispatcher, ViewUtils, Bound } from 'kombo';
import {ApplicationModel, PanelNames, AppModelState} from '../models/app';
import {Actions} from '../models/common';
import {CommonViews} from '../components/common';
import {init as resultsViewsInit} from './results/main';

export interface Views {
    Application:React.ComponentClass<{}>;
}

export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils<CommonViews>;
    appModel:ApplicationModel;
    panels:{
        remNumberPanel:React.ComponentClass<{}>,
        sumNumberModel:React.ComponentClass<{}>
    }
}

export function init({dispatcher, he, appModel, panels}:ViewsArgs):Views {

    const resultsViews = resultsViewsInit({dispatcher, he, appModel});
    const commonViews = he.getComponents();

    /**
     *
     * @param props
     */
    const Timer:React.SFC<{
        value:number;

    }> = (props) => {
        return <div className="Timer">{props.value}</div>;
    };

    const TimerBar:React.SFC<{
        value:number;

    }> = (props) => {
        const values = [];
        for (let i = 0; i < props.value; i += 1) {
            values.push(<span key={`t${i}`}>{'\u00a0'}</span>);
        }
        return <div className="TimerBar">{values}</div>;
    }

    /**
     *
     * @param props
     */
    const LastAnswerStatus:React.SFC<{
        values:Immutable.List<boolean>;

    }> = (props) => {
        return (
            <div className="LastAnswerStatus">
                Last answer: <commonViews.CheckMark status={props.values.last()} />
            </div>
        );
    };

    const MainMenu:React.SFC<{
        activePanel:PanelNames;

    }> = (props) => {

        const handleClick = (val) => () => {
            dispatcher.dispatch({
                type: Actions.SET_ACTIVE_PANEL,
                payload: {
                    value: val
                }
            })
        };

        const getClass = (ident:PanelNames) => {
            return props.activePanel === ident ? 'pure-button button-active' : 'pure-button';
        }

        return <ul className="MainMenu">
            <li>
                <a className={getClass(PanelNames.REMEMBER_NUMBERS)} onClick={handleClick(PanelNames.REMEMBER_NUMBERS)}>Remember numbers</a>
            </li>
            <li>
                <a className={getClass(PanelNames.SUM_NUMBERS)} onClick={handleClick(PanelNames.SUM_NUMBERS)}>Sum numbers</a>
            </li>
            <li>
                <a className={getClass(PanelNames.RESULTS)} onClick={handleClick(PanelNames.RESULTS)}>Results</a>
            </li>
        </ul>;
    }

    const Contents:React.SFC<{
        activePanel:PanelNames;

    }> = (props) => {
        switch (props.activePanel) {
            case PanelNames.REMEMBER_NUMBERS:
                return <panels.remNumberPanel />;
            case PanelNames.SUM_NUMBERS:
                return <panels.sumNumberModel />;
            case PanelNames.RESULTS:
                return <resultsViews.Results />;
            default:
                return <div>Not implemented yet :-(</div>
        }
    };

    const OptionsButton:React.SFC<{}> = (props) => {

        const handleClick = (props) => {
            dispatcher.dispatch({
                type: Actions.SHOW_TASK_OPTIONS
            });
        }

        return <a className="pure-button button-options" onClick={handleClick}>Options</a>;
    };

    class Application extends React.PureComponent<AppModelState> {

        componentDidMount() {
            dispatcher.dispatch({
                type: Actions.SET_ACTIVE_PANEL,
                payload: {
                    value: PanelNames.REMEMBER_NUMBERS
                }
            });
        }

        render() {
            return (
                <div>
                    <header>
                        <h1>Mentatix</h1>
                        <MainMenu activePanel={this.props.activePanel}  />
                    </header>
                    <section className="context-conf">
                        <OptionsButton />
                    </section>
                    <section>
                        <TimerBar value={this.props.timeRemaining} />
                        <Contents activePanel={this.props.activePanel} />
                    </section>
                    {this.props.showLastAnswer ?
                        <LastAnswerStatus values={this.props.answers} /> :
                        null}
                </div>
            );
        }
    }


    return {
        Application: Bound(Application, appModel)
    };
}