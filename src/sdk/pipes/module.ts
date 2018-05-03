import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JyDatePipe } from './date_pipe';

@NgModule({
    declarations: [JyDatePipe],
    imports: [ CommonModule ],
    exports: [JyDatePipe],
    providers: [],
})
export class JyPipesModule {}