import { Injectable, TemplateRef, ViewContainerRef, Injector } from '@angular/core';
import { Subject  } from 'rxjs/Subject';  //
import {  throttleTime } from 'rxjs/operator/throttleTime';
import { TemplatePortal, ComponentType, ComponentPortal } from '@angular/cdk/portal';

@Injectable()
export class QuikViewService {

    private _onOpen: Subject<any> = new Subject<any>();

    constructor(){}

    attachTemplate(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, context?: {[name: string]: any}) {
        this._onOpen.next(new TemplatePortal(templateRef, viewContainerRef, context));

    }

    attachComponent(component: ComponentType<any>, viewContainerRef: ViewContainerRef, injector?: Injector | null){
        this._onOpen.next(new ComponentPortal(component, viewContainerRef, injector));
    }

    get whenOpen(): Subject<any>{
        return this._onOpen;
    }
}