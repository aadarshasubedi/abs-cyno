import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export class AppConfig {

    /** 图标 */
    icon: string = "assets/favicon.ico";

    /** 图标 */
    titlePrefix: string = "ABS-CYNO";

    /** 开发菜单 */
    showDevMenusWhenDev: boolean = environment.production;

    /** 异常解析处理 */
    exceptionHandler: () => void;

    /** 菜单数据源 */
    menuDataS = {
        url: 'ngWeb/getMemus',
        method: 'get',
        findData: (body: any): Array<any> => {
            return body.data;
        }
    };

 }