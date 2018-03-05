import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../themes/login.component';
import { IndexComponent } from '../themes/index.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, // 登录界面
    { path: 'logout', component: LoginComponent }, // 退出
    { path: 'main', component: IndexComponent,  loadChildren: './pages/pages.module#PagesModule'}
];


@NgModule({
    declarations: [],
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule],
    providers: [],
})
export class AppRoutingModule {}
