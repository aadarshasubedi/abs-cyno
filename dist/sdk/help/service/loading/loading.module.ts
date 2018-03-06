import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingRoutingModule } from './loading.routing.module';
import { LoadingComponent } from './loading.component';
import { MainComponent } from './components/main.component';
import { MatCardModule} from '@angular/material/card';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatTabsModule} from '@angular/material/tabs';
import { MatDividerModule} from '@angular/material/divider';

@NgModule({
    declarations: [LoadingComponent, MainComponent],
    imports: [ CommonModule, LoadingRoutingModule, MatCardModule, MatToolbarModule
        , MatButtonModule, MatIconModule, MatTabsModule, MatDividerModule],
    exports: [],
    providers: [],
})
export class LoadingModule {}