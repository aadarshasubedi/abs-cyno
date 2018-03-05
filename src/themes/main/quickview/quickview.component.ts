import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef,
  ComponentFactoryResolver, ApplicationRef, Injector, ComponentRef, ViewRef, ViewContainerRef } from '@angular/core';
import { MatTableDataSource} from '@angular/material';
import { QuikViewService } from './quickview.service';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { TemplatePortal, ComponentType, ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { AppComponent } from '../../../app/app.component';
import { ActionType } from '../../../app/beans/ActionType';
import { Action } from '../../../app/beans/Action';

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quickview.scss']
})
export class QuickviewComponent implements OnInit {

  @ViewChild('quickviewContent') quickviewContent: ElementRef;

  private _domOutlet: DomPortalOutlet;

  private _currentComponentRef: ComponentRef<any>;

  private _currentViewRef: ViewRef;
  private _currentViewContainerRef: ViewContainerRef ;

  constructor(
    private quikViewService: QuikViewService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private appCmp: AppComponent
  ) { }

  ngOnInit() {
    this.quikViewService.whenOpen.pipe(debounceTime(500)).subscribe((cmp: any) => {
        if (cmp instanceof TemplatePortal) {
          this.attachTemplate(cmp);
        } else {
          this.attachComponent(cmp);
        }
    });
  }

  close() {
    this.appCmp.action.next(new Action(ActionType.MESSAGE_SHOW,  {status: 'close'}));
  }

  trigger() {
    this.appCmp.action.next(new Action(ActionType.MESSAGE_SHOW,  {status: 'trigger'}));
  }

  attachTemplate(templatePortal: TemplatePortal<any>) {
    if (this._currentViewRef) {
      const index: number = this._currentViewContainerRef.indexOf(this._currentViewRef);
      if (index !== -1) {
        this._currentViewContainerRef.remove(index);
      }
    }
    this._currentViewContainerRef = templatePortal.viewContainerRef;
    this._currentViewRef = this.outlet.attachTemplatePortal(templatePortal);
  }

  attachComponent(componentPortal: ComponentPortal<any>) {
    if (this._currentComponentRef){
      this._currentComponentRef.destroy();
    }

    this._currentComponentRef = this.outlet.attachComponentPortal(componentPortal);
  }

  get outlet(): DomPortalOutlet{
    return this._domOutlet || (this._domOutlet =
        new DomPortalOutlet(
          this.quickviewContent.nativeElement,
          this.componentFactoryResolver,
          this._appRef, this._injector));
  }
}
