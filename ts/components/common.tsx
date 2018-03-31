import * as React from 'react';
import {ActionDispatcher, ViewUtils} from 'kombo';
import{Actions} from '../models/common';

export interface CommonViews {
    CloseIcon:React.SFC<{
        title?:string;
        onClick:()=>void;
    }>;
    StartButton:React.SFC<{}>;
    CheckMark:React.SFC<{
        status:boolean
    }>;
}

export function init(dispatcher:ActionDispatcher, he:ViewUtils<CommonViews>):CommonViews {

    const CloseIcon:CommonViews['CloseIcon'] = (props) => {
        return <a className="CloseIcon" onClick={props.onClick} title={props.title}>{'\u274C'}</a>;
    }

    const StartButton:React.SFC<{}> = (props) => {

        const handleClick = () => {
            dispatcher.dispatch({
                type: Actions.START_TASK
            });
        };

        return <button className="pure-button pure-button-primary"
                    ref={elm => elm ? elm.focus() : null}
                    onClick={handleClick}>Next</button>;
    }

    const CheckMark:CommonViews['CheckMark'] = (props) => {
        return <span className={`CheckMark ${props.status ? 'correct' : 'incorrect'}`}>
           {props.status ? '\u2713' : '\u2717'}
        </span>;
    }

    return {
        CloseIcon: CloseIcon,
        StartButton: StartButton,
        CheckMark: CheckMark
    }
}