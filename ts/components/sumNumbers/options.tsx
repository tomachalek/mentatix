import * as React from 'react';
import {ActionDispatcher, ViewUtils} from 'kombo';
import {CommonViews} from '../common';
import {Actions as AppActions} from '../../models/common';
import {Actions, SumNumbersState} from '../../models/sumNumbers/main';


export function init(dispatcher:ActionDispatcher, he:ViewUtils<CommonViews>) {

    const commonViews = he.getComponents();

    const NumDigitsInput:React.SFC<{
        value:string;
        onChange:(evt:React.ChangeEvent<HTMLSelectElement>)=>void;

    }> = (props) => {

        return <select onChange={props.onChange}>
            <option value="2">2</option>
            <option value="2">3</option>
            <option value="2">4</option>
            <option value="2">5</option>
            <option value="2">6</option>
        </select>
    };

    /**
     *
     */
    class Options extends React.PureComponent<SumNumbersState> {

        constructor(props) {
            super(props);
            this.handleCloseClick = this.handleCloseClick.bind(this);
        }

        private handleCloseClick() {
            dispatcher.dispatch({
                type: AppActions.HIDE_TASK_OPTIONS
            });
        }

        private handleNumDigits(inpNum:number, evt:React.ChangeEvent<HTMLSelectElement>):void {
            dispatcher.dispatch({
                type: Actions.SET_OPTION_NUM_DIGITS,
                payload: {
                    inputNum: inpNum
                }
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
                                    <label>Num digits 1
                                        <NumDigitsInput onChange={this.handleNumDigits.bind(this, 1)}
                                                value={this.props.optionsNumDigits1} />
                                    </label>
                                </li>
                                <li>
                                <label>Num digits 2
                                        <NumDigitsInput onChange={this.handleNumDigits.bind(this, 2)}
                                                value={this.props.optionsNumDigits1} />
                                    </label>
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