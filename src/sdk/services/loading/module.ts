import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './loading.service';
import { JyLoadingComponent } from './loading.component';

@NgModule({
    declarations: [JyLoadingComponent],
    imports: [ CommonModule, OverlayModule, MatProgressSpinnerModule ],
    exports: [OverlayModule, MatProgressSpinnerModule],
    providers: [LoadingService],
    entryComponents: [JyLoadingComponent]
})
export class LoadingModule {}