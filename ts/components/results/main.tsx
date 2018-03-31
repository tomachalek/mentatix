import * as React from 'react';
import * as Immutable from 'immutable';
import {ActionDispatcher, ViewUtils, Bound} from 'kombo';
import {ApplicationModel, AppModelState} from '../../models/app';
import {Actions} from '../../models/common';
import {CommonViews} from '../../components/common';


export interface ViewsArgs {
    dispatcher:ActionDispatcher;
    he:ViewUtils<CommonViews>;
    appModel:ApplicationModel;
}

export interface Views {
    Results:React.ComponentClass<{}>;
}

export function init({dispatcher, he, appModel}:ViewsArgs):Views {

    const commonViews = he.getComponents();

    /**
     *
     * @param props
     */
    const AnswerList:React.SFC<{
        values:Immutable.List<boolean>;

    }> = (props) => {
        return (
            <table className="AnswerList">
                <tbody>
                    {props.values.map((v, i) =>
                        <tr key={`${i}:${v}`}>
                            <th>{`${i + 1}`}</th>
                            <td><commonViews.CheckMark status={v} /></td>
                        </tr>)}
                </tbody>
            </table>
        );
    };


    class Results extends React.PureComponent<AppModelState> {

        render() {
            return (
                <div>
                    <h2>Results</h2>
                    <AnswerList values={this.props.answers} />
                </div>
            );
        }
    }

    return {
        Results: Bound(Results, appModel)
    };

}