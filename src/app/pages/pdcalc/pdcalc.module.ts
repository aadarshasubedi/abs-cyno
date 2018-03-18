import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatInputModule} from '@angular/material/input';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule} from '@angular/material/card';
import { MatTableModule} from '@angular/material/table';
import { MatListModule} from '@angular/material/list';
import { MatDialogModule} from '@angular/material/dialog';
import { MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { PdcalcComponent } from './pdcalc.component';
import { MainComponent } from './components/main.component';
import { Chart1Component } from './components/chart/chart1.component';
import { ProjectZqjgComponent } from './components/projectzqjg/projectzqjg.compoment';
import { PdcalcRoutingModule } from './pdcalc.routing.module';
import { PdcalsService } from './service/pdcalc.service';

@NgModule({
    declarations: [PdcalcComponent, MainComponent, ProjectZqjgComponent, Chart1Component],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatButtonToggleModule,
        MatCardModule,
        MatTableModule,
        MatListModule,
        MatDialogModule,
        MatTabsModule,
        MatRadioModule,
        MatCheckboxModule,
        PdcalcRoutingModule],
    exports: [],
    providers: [PdcalsService],
})
export class PdcalcModule {}