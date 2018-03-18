import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockService } from './mock/mock.service';
@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [],
    providers: [MockService],
})
export class PdcalcMockModule {
    constructor(mockService: MockService){
        mockService.buildMock();
    }
}