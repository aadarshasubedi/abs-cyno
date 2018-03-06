import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HelpRoutingModule } from './help.routing.module';
import { HelpComponent } from './help.component';
@NgModule({
    declarations: [HelpComponent],
    imports: [ CommonModule, HelpRoutingModule],
    exports: [],
    providers: []
})
export class HelpModule {}