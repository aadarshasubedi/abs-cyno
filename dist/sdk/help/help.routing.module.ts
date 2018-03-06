import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from './help.component';

export const routes: Routes = [
    { path: '', component: HelpComponent, children: [
        {path: 'service-loading', loadChildren: './service/loading/loading.module#LoadingModule'}
    ] }
];


@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes)],
    exports: [ RouterModule],
    providers: [],
})
export class HelpRoutingModule {}