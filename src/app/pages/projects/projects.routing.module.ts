import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { MainComponent } from './components/main.component';

const routes: Routes = [{
    path: '',
    component: ProjectsComponent,
    children: [
        {path: 'projects', component: MainComponent}
    ]
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    providers: [],
})
export class ProjectsRoutingModule {}