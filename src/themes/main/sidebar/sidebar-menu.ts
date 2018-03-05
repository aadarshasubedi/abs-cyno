import { Component,  HostBinding, Input, Query, ViewChild } from '@angular/core';
import { MainComponent } from '../main.component';
import { SidebarMenuTriggerDirective } from './sidebar-menu-trigger';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
    selector: 'sidebar-menu',
    templateUrl: './sidebar-menu.html'
})
export class SidebarMenu implements OnInit {

    /** 菜单数据 */
    @Input() menuData: any;

    @Input() parentId: string;

    @Input() childLevel: any;

    @ViewChild(SidebarMenuTriggerDirective) sidebarTrigger: SidebarMenuTriggerDirective;

    constructor(private _mainComponent: MainComponent) { }

    ngOnInit() {
       this._mainComponent.onlyOneSidebarTriggerNotice.subscribe((menu: SidebarMenu) => {
            if (this.sidebarTrigger && ((<any>menu).closeAll === true || (menu.parentId === this.parentId && menu !== this))) {
                 this.sidebarTrigger.dispose();
            }
       });
    }

    /** 判断是否有子菜单节点 */
    hasChildren() {
        return this.menuData && this.menuData.children && this.menuData.children.length > 0;
    }

    get text(){
        return this.menuData.text;
    }

    get href(){
        return this.menuData.href;
    }

    get icon(){
        return this.menuData.icon;
    }

    get children(){
        return this.menuData.children;
    }

    get parent(){
        return this.parentId;
    }

    //
    onOpenChildMenu(event){
        console.log('open menu !!!!');
        this._mainComponent.onlyOneSidebarTriggerNotice.next(this);
    }

}
