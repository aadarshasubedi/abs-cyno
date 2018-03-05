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

// 定义页头 导航菜单 工作区三个组件
import { HeaderComponent} from './header/header.component';
import { EmailComponent } from './header/email/email.compoment';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { MainComponent } from './main/main.component';
import { QuickviewComponent } from './main/quickview/quickview.component';
import { QuikViewService } from './main/quickview/quickview.service';
import { SidebarMenuTriggerDirective } from './main/sidebar/sidebar-menu-trigger';
import { SidebarMenu } from './main/sidebar/sidebar-menu';

import { IndexComponent } from './index.component';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    QuickviewComponent,
    SidebarMenuTriggerDirective,
    SidebarMenu,
    EmailComponent,
    IndexComponent,
    LoginComponent
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
    RouterModule
  ],
  providers: [QuikViewService],
  exports: [
    RouterModule,
    HeaderComponent,
    MainComponent,
    QuickviewComponent,
    SidebarMenuTriggerDirective,
    SidebarMenu,
    EmailComponent],
    entryComponents: [EmailComponent]
})
export class ThemesModule { }
