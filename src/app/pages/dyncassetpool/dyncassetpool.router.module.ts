import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DyncAssetPoolComponent } from './dyncassetpool.component';
import { MainComponent } from './components/main.component';

const routes: Routes = [{
    path: '',
    component: DyncAssetPoolComponent,
    children: [
        {path: 'main', component: MainComponent}
    ]
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [RouterModule],
    providers: [],
})
export class DyncAssetPoolRouterModule {}