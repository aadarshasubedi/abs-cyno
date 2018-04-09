import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JyMaxValidator } from './validators/jy-max';
import { JyMinValidator } from './validators/jy-min';
import { JyNumberValidator } from './validators/jy-number';
import { JyFloatValidator } from './validators/jy-float';
@NgModule({
    declarations: [JyMaxValidator, JyMinValidator, JyNumberValidator, JyFloatValidator],
    imports: [ CommonModule ],
    exports: [JyMaxValidator, JyMinValidator, JyNumberValidator, JyFloatValidator],
    providers: [],
})
export class jyFormsModule {}