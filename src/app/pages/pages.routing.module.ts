import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'pdcalc',
        loadChildren: './pdcalc/pdcalc.module#PdcalcModule'
    },
    {
        path: 'projects',
        loadChildren: './projects/projects.module#ProjectsModule'
    }
];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    providers: [],
})
export class PagesRoutingModule {}