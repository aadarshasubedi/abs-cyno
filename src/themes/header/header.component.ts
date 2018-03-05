import {
    Component,
    OnInit,
    ViewEncapsulation,
    Inject,
    ViewContainerRef,
    Injector
} from '@angular/core';

import { AppComponent } from '../../app/app.component';
import { Action } from '../../app/beans/Action';
import { ActionType } from '../../app/beans/ActionType';
import { QuikViewService } from '../main/quickview/quickview.service';
import { Observable } from 'rxjs/Observable';
import { EmailComponent } from './email/email.compoment';


@Component({
    selector: 'app-header-component',
    templateUrl: './header.component.html',
    styleUrls: ['./header.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
    constructor(
        private appCmp: AppComponent,
        private quikViewService: QuikViewService,
        private viewContainerRef: ViewContainerRef,
        private injector: Injector
    ) {}

    ngOnInit() {

    }

    triggerMenuCollapse() {
        this.appCmp.action.next(new Action(ActionType.MENU_COLLAPSE));
    }

    showMessage() {
        this.quikViewService.attachComponent(EmailComponent, this.viewContainerRef, this.injector);
        this.appCmp.action.next(new Action(ActionType.MESSAGE_SHOW));
    }
}
