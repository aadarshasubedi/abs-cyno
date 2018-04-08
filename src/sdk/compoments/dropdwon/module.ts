import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatJyDropDown } from './jydropdown';
import { MatJyDropDownTriggerFor } from './jydropdown-triggerfor';

@NgModule({
    declarations: [MatJyDropDown, MatJyDropDownTriggerFor],
    imports: [ CommonModule ],
    exports: [MatJyDropDownTriggerFor, MatJyDropDown],
    providers: [],
})
export class MatJyDropDownModule {}