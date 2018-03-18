import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoadingService } from '../../sdk/services';

@Component({
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    providers: [LoginService]
})
export class LoginCmp implements OnInit {

    user: {userName?: string, password?: string} = {};

    message: {account?: string} = {};

    constructor(
        private loadingService: LoadingService,
        private loginService: LoginService,
        private router: Router
    ) { }

    ngOnInit() { }

    login() {
        if ((this.user.userName || '').trim() === '') {
            this.message.account = '账号不能为空!';
            return;
        }
        this.loadingService.showFull('登录中....');
        this.loginService.doLogin(this.user.userName, this.user.password).subscribe((data: any) => {
            this.loadingService.close();
            this.router.navigate(['index', 'pdcalc', 'pdcalc'])
        }, (error: any) => {
            this.message.account = error.error;
            this.loadingService.close();
        });
    }
}