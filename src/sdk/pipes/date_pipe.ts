import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'jydate', pure: true})
export class JyDatePipe extends DatePipe implements PipeTransform {
    transform(value: any, format = 'mediumDate', timezone?: string, locale?: string): string|null {
        //解决IE不兼容问题
        if (typeof value === 'string') {
            value = value.replace(/-/g, '/');
        }
        return super.transform(value, format, timezone, locale);
    }
}