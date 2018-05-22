import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages.routing.module';
import { RedirtUrl } from './redirt-url';
@NgModule({
    declarations: [RedirtUrl],
    imports: [ CommonModule, PagesRoutingModule ],
    exports: [],
    providers: [],
})
export class PagesModule {}