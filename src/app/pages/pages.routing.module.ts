import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RedirtUrl } from './redirt-url';
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
    },
    {
        path: 'statassetpool',
        loadChildren: './statassetpool/statassetpool.module#StatAssetPoolModule',
        data: {title: '静态池分析'}
    },
    {
        path: 'dyncassetpool',
        loadChildren: './dyncassetpool/dyncassetpool.module#DyncAssetPoolModule',
        data: {title: '动态池分析'}
    },
    {
        path: 'redirec-url',
        component: RedirtUrl
    },
    {
        path: 'redirec-url1',
        component: RedirtUrl
    }
];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    providers: [],
})
export class PagesRoutingModule {}