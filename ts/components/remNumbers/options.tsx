import * as React from 'react';
import { ActionDispatcher, ViewUtils} from 'kombo';
import {Actions} from '../../models/remNumbers/main';
import {Actions as AppActions} from '../../models/common';
import {CommonViews} from '../../components/common';

export interface OptionsProps {
    optionsTimeRemaining:string;
    optionsPatternLength:string;
}

export interface Views {
    Options:React.ComponentClass<OptionsProps>;
}

export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils<CommonViews>;
}

export function init({dispatcher, he}:ViewsArgs):Views {

    const commonViews = he.getComponents();

    /**
     *
     * @param props
     */
    const TimePlaySelect:React.SFC<{
        value:string;

    }> = (props) => {

        const handleChange = (evt:React.ChangeEvent<HTMLSelectElement>) => {
            dispatcher.dispatch({
                type: Actions.SET_OPTIONS_TIME_REMAINING,
                payload: {value: evt.target.value}
            });
        };

        return (
            <label>
                Time showing the stuff to remember:{'\u00a0'}
                <select value={props.value} onChange={handleChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </label>
        );
    };

    const PatternLength:React.SFC<{
        value:string;

    }> = (props) => {

        const handleChange = (evt:React.ChangeEvent<HTMLSelectElement>) => {
            dispatcher.dispatch({
                type: Actions.SET_OPTIONS_PATTERN_LENGTH,
                payload: {value: evt.target.value}
            });
        };

        return (
            <label>
                Pattern length:{'\u00a0'}
                <select value={props.value} onChange={handleChange}>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
            </label>
        );
    }

    /**
     *
     */
    class Options extends React.PureComponent<OptionsProps> {

        constructor(props) {
            super(props);
            this.handleCloseClick = this.handleCloseClick.bind(this);
        }

        private handleCloseClick() {
            dispatcher.dispatch({
                type: AppActions.HIDE_TASK_OPTIONS
            });
        }

        render() {
            return (
                <section className="modal-overlay">
                    <div className="Options closeable-frame">
                        <div className="heading"><commonViews.CloseIcon onClick={this.handleCloseClick} /></div>
                        <form>
                            <ul>
                                <li>
                                    <TimePlaySelect value={this.props.optionsTimeRemaining} />
                                </li>
                                <li>
                                    <PatternLength value={this.props.optionsPatternLength} />
                                </li>
                            </ul>
                        </form>
                    </div>
                </section>
            );
        }
    };

    return {
        Options: Options
    };

}