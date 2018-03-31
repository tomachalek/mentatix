import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Rx from 'rxjs/Rx';

import {init as viewsInit} from './components/app';
import {init as remNumberViewsInit} from './components/remNumbers/main';
import {init as sumNumbersViewInit} from './components/sumNumbers/main';
import {init as commonViewsInit} from './components/common';
import {RememberNumbers} from './models/remNumbers/main';
import {SumNumbers} from './models/sumNumbers/main';
import { ActionDispatcher, ViewUtils } from 'kombo';
import { ApplicationModel } from './models/app';
import {CommonViews} from './components/common';

declare var require:any;
require('../css/pure-min.css');
require('../css/style.css');

export class AppPage {

    constructor(conf:{}) {

    }

    private translations = {
        'en-US': {

        }
    }


    init():void {
        const dispatcher = new ActionDispatcher();
        const appModel = new ApplicationModel(dispatcher);
        const remNumberModel = new RememberNumbers(dispatcher);
        const sumNumbersModel = new SumNumbers(dispatcher);

        const viewUtils = new ViewUtils<CommonViews>(
            'en_US',
            this.translations
        );

        const commonViews = commonViewsInit(dispatcher, viewUtils);
        viewUtils.attachComponents(commonViews);

        const remNumberViews = remNumberViewsInit({
            dispatcher: dispatcher,
            he: viewUtils,
            remNumberModel: remNumberModel
        });

        const sumNumbersViews = sumNumbersViewInit({
            dispatcher: dispatcher,
            he: viewUtils,
            sumNumberModel: sumNumbersModel
        });

        const component = viewsInit({
            dispatcher: dispatcher,
            he: viewUtils,
            appModel: appModel,
            panels: {
                remNumberPanel: remNumberViews.Panel,
                sumNumberModel: sumNumbersViews.Panel
            }
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