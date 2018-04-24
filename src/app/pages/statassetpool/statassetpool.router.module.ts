import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatAssetPoolComponent } from './statassetpool.component';
import { MainComponent } from './components/main.component';
import { AddComponent } from './components/add/add.component';
import { AnalyseMainComponent } from './components/analyse/main';

const routes: Routes = [{
    path: '',
    component: StatAssetPoolComponent,
    children: [
        {path: 'main', component: MainComponent},
        {path: 'add', component: AddComponent},
        {path: 'analyse', component: AnalyseMainComponent}
    ]
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [RouterModule],
    providers: [],
})
export class StatAssetPoolRouterModule {}