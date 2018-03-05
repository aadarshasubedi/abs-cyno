import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { AppComponent } from '../../../app/app.component';
import { SidebarService } from './sidebar.service';
import { Action } from '../../../app/beans/Action';
import { ActionType } from '../../../app/beans/ActionType';

@Component({
  selector: 'app-sidebar-component',
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sidebar.scss'],
  providers: [ SidebarService ]
})
export class SidebarComponent implements OnInit {

  menulist: any = [];

  constructor(private _appComponent: AppComponent,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.sidebarService.getMenus().subscribe((data: any) => {
      this.menulist = data;
    })
  }

  @HostListener('click')
  onClick() {
    this._appComponent.action.next(new Action(ActionType.MENU_COLLAPSE, {status: false}));
  }
}
