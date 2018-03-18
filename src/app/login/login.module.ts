import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginCmp } from './login';

@NgModule({
    declarations: [LoginCmp],
    imports: [ CommonModule, FormsModule, RouterModule],
    exports: [LoginCmp],
    providers: [],
})
export class LoginModule {}