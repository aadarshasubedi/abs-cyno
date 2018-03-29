import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatCardModule} from '@angular/material/card';
import { MatListModule} from '@angular/material/list';
import { MatDialogModule} from '@angular/material/dialog';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatTabsModule} from '@angular/material/tabs';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule} from '@angular/material/radio';
import { MainComponent } from './components/main.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects.routing.module';

import { TableModule} from '../../../sdk/compoments/table/module';
import { MAT_PAGINATOR_INTL_PROVIDER } from '../../../sdk/compoments/paginator/matPaginatorIntl';

@NgModule({
    declarations: [ProjectsComponent, MainComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatGridListModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatProgressBarModule,
        MatDividerModule,
        MatCardModule,
        MatButtonModule,
        TableModule,
        MatListModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTabsModule,
        MatRadioModule,
        MatCheckboxModule,
        FormsModule,
        ProjectsRoutingModule ],
    exports: [],
    providers: [MAT_PAGINATOR_INTL_PROVIDER],
})
export class ProjectsModule {}