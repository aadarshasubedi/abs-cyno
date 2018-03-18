import { NgModule } from '@angular/core';
import {ThemesMockModule} from '../themes/themes.mock.module';
import { LoginMockModule } from './login/login.mock.module';
import { PdcalcMockModule } from './pages/pdcalc/pdcalc.mock.module';

@NgModule({
    declarations: [],
    imports: [ThemesMockModule, LoginMockModule, PdcalcMockModule],
    providers: [],
    bootstrap: []
  })
export class AppMockDevModule {}
