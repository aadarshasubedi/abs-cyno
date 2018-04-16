import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDividerModule} from '@angular/material/divider';
import { MatCardModule} from '@angular/material/card';
import { MatTableModule} from '@angular/material/table';
import { MatListModule} from '@angular/material/list';
import { MatDialogModule} from '@angular/material/dialog';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatTabsModule} from '@angular/material/tabs';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule} from '@angular/material/radio';
import { PdcalcComponent } from './pdcalc.component';
import { MainComponent } from './components/main.component';
import { CesuanParam } from './components/chart/cesuan-param';
import { ChartIncomeRateComponent } from './components/chart/incomerate';
import { PressureSceMain } from './components/pressuresce/main';
import { benchParam } from './components/pressuresce/params/bench';
import { SceneParam } from './components/pressuresce/params/scene';
import { RateTypeParam } from './components/pressuresce/params/rate.type';
import { BenchCurveset } from './components/pressuresce/params/bench.curveset';
import { SecuStructureComponent } from './components/secustructure/secustructure.compoment';
import { PdcalcRoutingModule } from './pdcalc.routing.module';
import { PdcalsService } from './service/pdcalc.service';
import { jyFormsModule } from '../../../sdk/services';
import { TableModule} from '../../../sdk/compoments/table/module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [
        PressureSceMain,
        BenchCurveset,
        benchParam,
        SceneParam,
        RateTypeParam,
        CesuanParam,
        PdcalcComponent,
        MainComponent,
        SecuStructureComponent,
        ChartIncomeRateComponent],
    imports: [
        TableModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatButtonModule,
        MatGridListModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatCardModule,
        MatTableModule,
        MatListModule,
        MatDialogModule,
        MatTabsModule,
        MatRadioModule,
        MatCheckboxModule,
        jyFormsModule,
        FormsModule,
        NgxEchartsModule,
        PdcalcRoutingModule],
    exports: [CesuanParam],
    entryComponents: [CesuanParam, BenchCurveset],
    providers: [PdcalsService],
})
export class PdcalcModule {}