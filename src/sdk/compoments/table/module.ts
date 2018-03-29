import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatExtTable } from './table';
import { HeaderGroupCell, HeaderGroupCellOutlet } from './header-group-cell';
import { HeaderGroup } from './header-group';
import { JyCdkHeaderRow, JyCdkHeaderCellOutlet, JyCdkRow, JyCdkGroupRow } from './row';
import { GroupCell, GroupCellOutlet } from './group-cell';
import { GroupCellRowCellOutlet, GroupCellRowDef, GroupRowCell} from './group-row';

@NgModule({
    declarations: [
        MatExtTable,
        HeaderGroupCell,
        HeaderGroupCellOutlet,
        HeaderGroup,
        JyCdkHeaderRow,
        GroupCellOutlet,
        JyCdkHeaderCellOutlet,
        GroupCell,
        GroupCellRowCellOutlet,
        GroupCellRowDef,
        GroupRowCell,
        JyCdkGroupRow,
        JyCdkRow],
    imports: [ CommonModule, CdkTableModule],
    exports: [ 
        MatExtTable, 
        CdkTableModule, 
        HeaderGroupCell, 
        HeaderGroupCellOutlet, 
        GroupCellOutlet,
        HeaderGroup, 
        JyCdkHeaderRow, 
        JyCdkHeaderCellOutlet, 
        GroupCell,
        GroupCellRowCellOutlet,
        GroupCellRowDef,
        GroupRowCell,
        JyCdkGroupRow,
        JyCdkRow],
    providers: [],
})
export class TableModule {}