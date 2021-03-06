import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatInputModule} from '@angular/material/input';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule} from '@angular/material/card';
import { MatTableModule} from '@angular/material/table';
import { MatListModule} from '@angular/material/list';
import { MatDialogModule} from '@angular/material/dialog';
import { MatTabsModule} from '@angular/material/tabs';

// 定义页头 导航菜单 工作区三个组件
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './main/main.component';
import { IndexBanner } from './index-banner/index-banner';

@NgModule({
  declarations: [
    MainComponent,
    NavComponent,
    IndexBanner,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    RouterModule,
    MatTabsModule
  ],
  providers: [],
  exports: [
    RouterModule
    ],
    entryComponents: []
})
export class ThemesModule { }
