import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatExtTable } from './table';
import { HeaderGroupCell, HeaderGroupCellOutlet } from './header-group-cell';
import { HeaderGroup } from './header-group';
import { JyCdkHeaderRow, JyCdkHeaderCellOutlet } from './row';

@NgModule({
    declarations: [MatExtTable, HeaderGroupCell, HeaderGroupCellOutlet, HeaderGroup, JyCdkHeaderRow, JyCdkHeaderCellOutlet],
    imports: [ CommonModule, CdkTableModule],
    exports: [ MatExtTable, CdkTableModule, HeaderGroupCell, HeaderGroupCellOutlet, HeaderGroup, JyCdkHeaderRow, JyCdkHeaderCellOutlet],
    providers: [],
})
export class TableModule {}