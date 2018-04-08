import { 
    Directive,
    ViewContainerRef,
    Input,
    ElementRef,
    OnDestroy
 } from '@angular/core';

 import {
    ConnectedPositionStrategy,
    HorizontalConnectionPos,
    Overlay,
    OverlayRef,
    OverlayConfig,
    RepositionScrollStrategy,
    ScrollStrategy,
    VerticalConnectionPos,
  } from '@angular/cdk/overlay';
  import {TemplatePortal} from '@angular/cdk/portal';

 import { MatJyDropDown } from './jydropdown';

@Directive({
    selector: '[matJyDropDownTriggerFor]',
    host: {
        '(click)': '_handleClick($event)'
    }
})
export class MatJyDropDownTriggerFor implements OnDestroy {

    @Input('matJyDropDownTriggerFor') dropDropDown: MatJyDropDown;

    _overlayRef: OverlayRef;

    _portal:  TemplatePortal;

    constructor(
        private _element: ElementRef,
        private _viewContainerRef: ViewContainerRef,
        private _overlay: Overlay
    ){}

    _handleClick(event){
        this.createOverlay().attach(this._portal);
    }

    private createOverlay(){
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.dropDropDown.templateRef, this._viewContainerRef);
            this._portal = new TemplatePortal(this.dropDropDown.templateRef, this._viewContainerRef);
            const config = this._getOverlayConfig();
            this._overlayRef = this._overlay.create(config);
            this._overlayRef.backdropClick().subscribe(() => {
                this._overlayRef.detach();
            });
          }
          return this._overlayRef;
    }

    private _getOverlayConfig(): OverlayConfig {
        return new OverlayConfig({
          positionStrategy: this._getPosition(),
          hasBackdrop: true,
          scrollStrategy: this._overlay.scrollStrategies.reposition()
        });
    }

    private _getPosition(): ConnectedPositionStrategy {
        let [originX, originFallbackX]: HorizontalConnectionPos[] =  ['start', 'end'];
        let [overlayY, overlayFallbackY]: VerticalConnectionPos[] =  ['top', 'bottom'];
        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];

        return this._overlay.position()
            .connectedTo(this._element, {originX, originY}, {overlayX, overlayY})
            .withOffsetY(0)
            .withFallbackPosition(
                {originX: originFallbackX, originY},
                {overlayX: overlayFallbackX, overlayY})
            .withFallbackPosition(
                {originX, originY: originFallbackY},
                {overlayX, overlayY: overlayFallbackY},
                undefined, 0)
            .withFallbackPosition(
                {originX: originFallbackX, originY: originFallbackY},
                {overlayX: overlayFallbackX, overlayY: overlayFallbackY},
                undefined, 0);
    }

    ngOnDestroy() {
        if (this._overlayRef) {
        this._overlayRef.dispose();
        this._overlayRef = null;
        }
      }
}