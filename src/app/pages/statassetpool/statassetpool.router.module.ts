import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatAssetPoolComponent } from './statassetpool.component';
import { MainComponent } from './components/main.component';
import { AddComponent } from './components/add/add.component';
import { AnalyseMainComponent } from './components/analyse/main';
import { AnalyseDetail } from './components/detail/detail';
import { ImportComponent } from './components/import/import';

const routes: Routes = [{
    path: '',
    component: StatAssetPoolComponent,
    children: [
        {path: 'main', component: MainComponent},
        {path: 'add', component: AddComponent},
        {path: 'edit/:id', component: AddComponent},
        {path: 'analyse/:id', component: AnalyseMainComponent},
        {path: 'detail/:id', component: AnalyseDetail},
        {path: 'import/:id', component: ImportComponent}
    ]
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [RouterModule],
    providers: [],
})
export class StatAssetPoolRouterModule {}