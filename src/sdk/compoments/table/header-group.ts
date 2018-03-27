import { Directive } from '@angular/core';

@Directive({
    selector: 'header-group',
    host: {
        'class': 'header-group cdk-header-cell'
    }
})
export class HeaderGroup { }