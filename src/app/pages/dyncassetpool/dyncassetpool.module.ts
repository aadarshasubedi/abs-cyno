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
import { jyFormsModule } from '../../../sdk/services';
import { TableModule} from '../../../sdk/compoments/table/module';
import { NgxEchartsModule } from 'ngx-echarts';

import { DyncAssetPoolService } from './service/dyncassetpool.service';
import { MainComponent } from './components/main.component';
import { DyncAssetPoolComponent } from './dyncassetpool.component';
import { DyncAssetPoolRouterModule } from './dyncassetpool.router.module';

@NgModule({
    declarations: [MainComponent, DyncAssetPoolComponent],
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
        DyncAssetPoolRouterModule
     ],
    exports: [],
    providers: [DyncAssetPoolService],
})
export class DyncAssetPoolModule {}