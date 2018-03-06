import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './loading.component';
import { MainComponent } from './components/main.component';

const routes: Routes = [{
    path: 'read',
    component: LoadingComponent,
    children: [
        {
            path: '',
            component: MainComponent
        }
    ]
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class LoadingRoutingModule {}