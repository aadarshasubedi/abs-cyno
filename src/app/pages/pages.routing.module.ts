import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: 'doc',
    loadChildren: '../../sdk/help/help.module#HelpModule'
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    providers: [],
})
export class PagesRoutingModule {}