import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ThemesModule } from '../themes/themes.module';
import { environment } from '../environments/environment';
import { AppMockDevModule } from './app.mock.module';
import { AppMockModule } from './app.mock.module.prod';
import { SdkHttpModule, MessageModule, LoadingModule } from '../sdk/services';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app.routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ThemesModule,
    CommonModule,
    BrowserAnimationsModule,
    AppMockDevModule,
    //(environment.production ? AppMockModule : AppMockDevModule),
    SdkHttpModule,
    MessageModule,
    LoadingModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
