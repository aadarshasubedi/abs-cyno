import { NgModule } from '@angular/core';
import { MenuMock } from './main/mock/menu.mock';
@NgModule({
    declarations: [],
    imports: [],
    providers: [MenuMock],
    bootstrap: []
  })
export class ThemesMockModule {
    constructor(menuMock: MenuMock) {
        menuMock.buildMock();
    }
}
