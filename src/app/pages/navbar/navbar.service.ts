import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class NavBarService {

    static breadcrumb: Subject<any> = new Subject<any>();

}