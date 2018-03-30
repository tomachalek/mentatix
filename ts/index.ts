import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Rx from 'rxjs/Rx';

import {init as viewsInit} from './components/app';
import {init as remNumberViewsInit} from './components/remNumbers';
import {RememberNumbers} from './models/remNumbers';
import { ActionDispatcher, ViewUtils } from 'kombo';
import { ApplicationModel } from './models/app';

declare var require:any;
require('../css/pure-min.css');
require('../css/style.css');

export class AppPage {

    constructor(conf:{}) {

    }


    init():void {
        console.log('page initialized');
        const dispatcher = new ActionDispatcher();
        const appModel = new ApplicationModel(dispatcher);
        const remNumberModel = new RememberNumbers(dispatcher);
        const viewUtils = new ViewUtils('en_US');

        const remNumberViews = remNumberViewsInit({
            dispatcher: dispatcher,
            he: viewUtils,
            remNumberModel: remNumberModel
        });

        const component = viewsInit({
            dispatcher: dispatcher,
            he: viewUtils,
            appModel: appModel,
            panels: {
                remNumberPanel: remNumberViews.Panel
            }
        });

        const myObservable = Rx.Observable.create(observer => {
            observer.next({value: 'foo'});
            let i = 0;
            setInterval(() => {
                observer.next({value: `bar: ${i}`});
                i += 1;
            },
                1000
            );
          });

          ReactDOM.render(
            React.createElement(component.Application),
            window.document.getElementById('app-mount')
        );
    }
}


export function init(conf:{}):void {
    new AppPage(conf).init();
}