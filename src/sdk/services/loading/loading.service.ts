import { Injectable, Inject, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef, GlobalPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operators/filter';
import { JyLoadingComponent } from './loading.component';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class LoadingService {

    private _showed: Subject<any> = new Subject<any>();

    private _overlayRef: OverlayRef;

    private componentRef: ComponentRef<any>;

    private defaultMsg: string = '处理中....';

    constructor(private overlay: Overlay, @Inject(DOCUMENT) private _document: any) {
        this._showed.subscribe((e) => {
            this.doHandler(e);
        });
    }

    showFull(msg?: string) {
        this._showed.next({type: 'full', msg: msg});
    }

    showModule(msg?: string) {
        this._showed.next({type: 'module', msg: msg});
    }

    close() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
        this._overlayRef = null;
        this.componentRef = null;
    }

    private doHandler(event: {type: 'full' | 'module', msg: string}) {
        const msg = event.msg || this.defaultMsg;
        if (this._overlayRef) {
            this.componentRef.instance.data.message = msg;
            return;
        }
        this.createOverlayRef();
        this.componentRef = this._overlayRef.attach(new ComponentPortal(JyLoadingComponent)) ;
        this.componentRef.instance.data.message = msg ;
    }

    private createOverlayRef(): OverlayRef{
        const _posiStratery = new GlobalPositionStrategy(this._document);
        _posiStratery.centerHorizontally();
        _posiStratery.centerVertically();
        return this._overlayRef || (this._overlayRef = this.overlay.create({
            positionStrategy: _posiStratery,
            hasBackdrop: true
        }));
    }
}