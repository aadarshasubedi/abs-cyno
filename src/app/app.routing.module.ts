import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginCmp } from './login/login';
import { IndexComponent } from './pages/index';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
    { path: 'index', canLoad: [AuthGuard], component: IndexComponent, loadChildren: './pages/pages.module#PagesModule'},
    { path: 'login', component: LoginCmp},
    { path: '', redirectTo: 'index', pathMatch: 'full' }
];


@NgModule({
    declarations: [],
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule],
    providers: [],
})
export class AppRoutingModule {}
