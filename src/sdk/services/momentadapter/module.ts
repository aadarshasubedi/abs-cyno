import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_LOCALE,
    MAT_DATE_LOCALE_PROVIDER,
    MAT_DATE_FORMATS
  } from '@angular/material';

import { MAT_MOMENT_DATE_FORMATS } from './jymoment-date-formats';
import { JyMomentDateAdapter } from './jymoment-date-adapter';

@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [],
    providers: [
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        {provide: MAT_DATE_LOCALE, useValue: 'zh_ch'},
        {provide: DateAdapter, useClass: JyMomentDateAdapter, deps: [MAT_DATE_LOCALE]}
    ],
})
export class MomentAdapterModule {}