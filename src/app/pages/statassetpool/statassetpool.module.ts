import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { jyFormsModule } from '../../../sdk/services';
import { TableModule} from '../../../sdk/compoments/table/module';
import { NgxEchartsModule } from 'ngx-echarts';
import { StatAssetPoolService } from './service/statassetpool.service';
import { MainComponent } from './components/main.component';
import { AddComponent } from './components/add/add.component';
import { StatAssetPoolComponent } from './statassetpool.component';
import { AnalyseMainComponent } from './components/analyse/main';
import { analyseWy } from './components/analyse/wy';
import { analyseZc } from './components/analyse/zc';
import { analyseHg } from './components/analyse/hg';
import { AnalyseDetail } from './components/detail/detail';
import { StatAssetPoolRouterModule } from './statassetpool.router.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE_PROVIDER, MAT_DATE_LOCALE} from '@angular/material';
import { JyPipesModule } from '../../../sdk/pipes';

@NgModule({
    declarations: [
        MainComponent,
        StatAssetPoolComponent,
        AddComponent,
        AnalyseMainComponent,
        analyseWy,
        analyseZc,
        analyseHg,
        AnalyseDetail
    ],
    imports: [
        JyPipesModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MatDatepickerModule,
        TableModule,
        MatProgressSpinnerModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatButtonModule,
        MatGridListModule,
        MatSelectModule,
        MatPaginatorModule,
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
        ReactiveFormsModule,
        NgxEchartsModule,
        StatAssetPoolRouterModule
     ],
    exports: [],
    providers: [
        StatAssetPoolService
    ]
})
export class StatAssetPoolModule {}