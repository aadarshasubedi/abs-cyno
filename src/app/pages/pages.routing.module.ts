import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'pdcalc',
        loadChildren: './pdcalc/pdcalc.module#PdcalcModule',
        data: {title: '收益率分配测算'}
    },
    {
        path: 'projects',
        loadChildren: './projects/projects.module#ProjectsModule',
        data: {title: '项目总览'}
    }
];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    providers: [],
})
export class PagesRoutingModule {}