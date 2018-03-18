import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mock } from './mock';

@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [],
    providers: [Mock],
})
export class LoginMockModule {
    constructor(mock: Mock) {
        mock.buildMock();
    }
}