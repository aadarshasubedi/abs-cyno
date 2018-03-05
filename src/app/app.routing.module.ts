import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../themes/login.component';
import { IndexComponent } from '../themes/index.component';

export const routes: Routes = [
    { path: '', component: IndexComponent,  loadChildren: './pages/pages.module#PagesModule'},
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];


@NgModule({
    declarations: [],
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule],
    providers: [],
})
export class AppRoutingModule {}
