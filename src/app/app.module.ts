import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
//import { ThemesModule } from '../themes/themes.module';
import { environment } from '../environments/environment';
import { AppMockDevModule } from './app.mock.module';
import { AppMockModule } from './app.mock.module.prod';
import { SdkHttpModule, MessageModule, LoadingModule } from '../sdk/services';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app.routing.module';
import { RouterModule } from '@angular/router';

import { LoginModule } from './login/login.module';
import { IndexComponent } from './pages/index';
import { NavBarComponent } from './pages/navbar/navbar';

//扩展services
import { BASE_PROVODERS } from './services/public-api';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    //ThemesModule,
    CommonModule,
    BrowserAnimationsModule,
    AppMockDevModule,
    //(environment.production ? AppMockModule : AppMockDevModule),
    SdkHttpModule,
    MessageModule,
    LoadingModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    LoginModule
  ],
  providers: [AppConfig, BASE_PROVODERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
