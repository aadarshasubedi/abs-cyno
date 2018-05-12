import { Injectable } from '@angular/core';
import { MatPaginatorIntl  } from '@angular/material/paginator/';

/** @docs-private */
export function MAT_PAGINATOR_INTL_PROVIDER_FACTORY() {
    const r = new MatPaginatorIntl();
    r.firstPageLabel = '第一页';
    r.itemsPerPageLabel = '每页';
    r.nextPageLabel = '下一页';
    r.lastPageLabel = '最后一页';
    r.previousPageLabel = '上一页';
    return r;
}
  
/** @docs-private */
export const MAT_PAGINATOR_INTL_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: MatPaginatorIntl,
    deps: [],
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY
};