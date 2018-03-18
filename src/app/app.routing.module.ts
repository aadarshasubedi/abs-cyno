import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginCmp } from './login/login';
import { Index1Component } from '../themes/index1';
import { Index2Component } from '../themes/index2';
import { IndexComponent } from './pages/index';

export const routes: Routes = [
    { path: 'index', component: IndexComponent, loadChildren: './pages/pages.module#PagesModule'},
    { path: 'login', component: LoginCmp },
    { path: 'i', component: Index1Component },
    { path: 'ii', component: Index2Component },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];


@NgModule({
    declarations: [],
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule],
    providers: [],
})
export class AppRoutingModule {}
