import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PdcalcComponent } from './pdcalc.component';
import { MainComponent } from './components/main.component';

const routes: Routes = [{
    path: '',
    component: PdcalcComponent,
    children: [
        {path: 'pdcalc/:proposalId/:type/:secCode/:initType', component: MainComponent},
        {path: 'pdcalc/:proposalId/:type/:secCode', component: MainComponent},
        {path: 'pdcalc/:proposalId/:type', component: MainComponent}
    ]
}];

@NgModule({
    declarations: [],
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    providers: [],
})
export class PdcalcRoutingModule {}