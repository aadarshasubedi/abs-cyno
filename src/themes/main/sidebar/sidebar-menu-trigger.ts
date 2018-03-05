import {DOCUMENT} from '@angular/common';
import {
    Directive,
    Optional,
    Self,
    ElementRef,
    ViewContainerRef,
    Inject,
    Input,
    Output,
    EventEmitter,
    ApplicationRef,
    ComponentFactoryResolver,
    Injector,
    NgZone
 } from '@angular/core';
import {
    AnimationBuilder,
    AnimationFactory,
    AnimationPlayer,
    style,
    animate
} from '@angular/animations';
import {
    MatMenuTrigger,
    MatMenuItem,
    MatMenuPanel,
    MatMenu,
    MAT_MENU_SCROLL_STRATEGY
} from '@angular/material/menu';

import {
    Overlay,
    OverlayRef,
    OverlayConfig,
    RepositionScrollStrategy,
    ScrollStrategy,
    VerticalConnectionPos,
} from '@angular/cdk/overlay';

import {
    Direction,
    Directionality
} from '@angular/cdk/bidi';

import {
    DomPortalOutlet,
    TemplatePortal
} from '@angular/cdk/portal';

import { AppComponent } from '../../../app/app.component';
import { Subject } from 'rxjs/Subject';

declare let Promise: any;

/**
 * 侧边条菜单触发指令: mini模式下浮动显示菜单, 否则非浮动模式显示菜单
 * @author xiufu.wang
 * @since 1.0.0 [2018-01-17]
 */
@Directive({
    selector: '[sidebarMenuTriggerFor]',
    host: {
        'aria-haspopup': 'true',
        '(mousedown)': '_handleMousedown($event)',
        '(keydown)': '_handleKeydown($event)',
        '(click)': '_handleClick($event)'
      },
      exportAs: 'sidebarMenuTrigger'
})
export class SidebarMenuTriggerDirective extends MatMenuTrigger{

    constructor(
        private _xoverlay: Overlay,
        private _xelement: ElementRef,
        private _xviewContainerRef: ViewContainerRef,
        @Inject(MAT_MENU_SCROLL_STRATEGY) private _xscrollStrategy,
        @Optional() private _xparentMenu: MatMenu,
        @Optional() @Self() private _xmenuItemInstance: MatMenuItem,
        @Optional() private _xdir: Directionality,
        private root: AppComponent,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _injector: Injector,
        private _ngZone: NgZone,
        @Inject(DOCUMENT) private _document: any,
        private _builder: AnimationBuilder
    ) {
            super(_xoverlay, _xelement, _xviewContainerRef, _xscrollStrategy, _xparentMenu, _xmenuItemInstance, _xdir);
        }

        @Input('sidebarMenuTriggerFor') menu: MatMenuPanel;

        @Output('onOpen') _opened: EventEmitter<string> = new EventEmitter<string>(); 

        subDomPortalOutlet: DomPortalOutlet;

        placeHolderPanel: any;

        ngAfterContentInit(){
           super.ngAfterContentInit();
        }

        openMenu() {
            if (this.isFloat()) {
                super.openMenu();
            } else {
                if (this.subDomPortalOutlet) {
                    this.dispose();
                    return;
                }
                this._createSubDomPortalOutlet();
                this.subDomPortalOutlet.attachTemplatePortal(new TemplatePortal(this.menu.templateRef, this._xviewContainerRef));

                this._doAnimationHeight('0px', `${this.placeHolderPanel.scrollHeight}px`, () => {
                    if (this.menu instanceof MatMenu) {
                        this.menu._startAnimation();
                    }
                    this.placeHolderPanel.style.height = 'unset';
                });

                this._opened.emit('click');
            }
        }

        isFloat(): Boolean {
            return false;
        }

        private _createSubDomPortalOutlet(): DomPortalOutlet{
            return this.subDomPortalOutlet || (this.subDomPortalOutlet = new DomPortalOutlet(
                    this._createsPlaceHolderPanel(),
                    this._componentFactoryResolver,
                    this._appRef,
                    this._injector
            ));
        }

        dispose(): void {
            if (this.subDomPortalOutlet){
                this._doAnimationHeight(`${this.placeHolderPanel.scrollHeight}px`, '0px', () => {
                    if (this.menu instanceof MatMenu) {
                        this.menu._resetAnimation();
                    }
                    this.subDomPortalOutlet.dispose();
                    this.subDomPortalOutlet = null;
                });
            }
        }

        private _createsPlaceHolderPanel() {
            const panel = this._document.createElement('ul');
            panel.classList.add('list-group', 'sub-menu');
            this._xelement.nativeElement.parentNode.appendChild(panel);
            this.placeHolderPanel = panel;
            return panel;
        }

        private _doAnimationHeight(fromHeight: string, toHeight: string, done: () => void): void {
            let _animation: AnimationFactory,
                _palyer: AnimationPlayer;
                _animation  = this._builder.build([
                    style({ height: fromHeight}),
                    animate(350, style({ height: toHeight}))
                ]);
                _palyer = _animation.create(this.placeHolderPanel);
                _palyer.onDone(() => {
                    _palyer.destroy();
                    done();
                });
                _palyer.play();
        }
}