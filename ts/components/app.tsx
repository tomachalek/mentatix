import * as React from 'react';
import * as Immutable from 'immutable';
import { ActionDispatcher, ViewUtils, Bound } from 'kombo';
import {ApplicationModel, PanelNames, Actions, AppModelState} from '../models/app';

export interface Views {
    Application:React.ComponentClass<{}>;
}

export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils;
    appModel:ApplicationModel;
    panels:{
        remNumberPanel:React.ComponentClass<{}>
    }
}

export function init({dispatcher, he, appModel, panels}:ViewsArgs):Views {

    /**
     *
     * @param props
     */
    const Timer:React.SFC<{
        value:number;

    }> = (props) => {
        return <div className="Timer">{props.value}</div>;
    };

    /**
     *
     * @param props
     */
    const AnswerStatus:React.SFC<{
        values:Immutable.List<boolean>;

    }> = (props) => {
        return (
            <table className="AnswerStatus">
                <tbody>
                    {props.values.map((v, i) =>
                        <tr key={`${i}:${v}`}><th>{`${i + 1}`}</th><td>{v.toString()}</td></tr>)}
                </tbody>
            </table>
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

        return <ul className="MainMenu">
            <li>
                <a className="pure-button" onClick={handleClick(PanelNames.REMEMBER_NUMBERS)}>Remember numbers</a>
            </li>
            <li>
                <a className="pure-button" onClick={handleClick(PanelNames.SUM_NUMBERS)}>Sum numbers</a>
            </li>
        </ul>;
    }

    const Contents:React.SFC<{
        activePanel:PanelNames;

    }> = (props) => {
        switch (props.activePanel) {
            case PanelNames.REMEMBER_NUMBERS:
                return <panels.remNumberPanel />
            default:
                return <div>Not implemented yet :-(</div>
        }
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
                        <h1>Membrain :-)</h1>
                        <MainMenu activePanel={this.props.activePanel}  />
                    </header>
                    <section>
                        <Timer value={this.props.timeRemaining} />
                        <Contents activePanel={this.props.activePanel} />
                    </section>
                    <AnswerStatus values={this.props.answers} />
                </div>
            );
        }
    }


    return {
        Application: Bound(Application, appModel)
    };
}