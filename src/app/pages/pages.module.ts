import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkSpaceComponent } from './workspace.component';
import { PagesRoutingModule } from './pages.routing.module';

@NgModule({
    declarations: [WorkSpaceComponent],
    imports: [ CommonModule, PagesRoutingModule ],
    exports: [],
    providers: [],
})
export class PagesModule {}