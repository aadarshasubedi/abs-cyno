import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageDialogComponent } from './dialog.compoment';

@Injectable()
export class MessageService {

    private showModaled: Boolean = false;

    private currentMatDialogRef: MatDialogRef<any>;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog){}

    snackInfo(message: string) {
        this.snack(message, 'info');
    }

    snackWarn(message: string) {
        this.snack(message, 'warn');
    }

    snackError(message: string) {
        this.snack(message, 'error');
    }

    alertInfo(message, title?: string): MatDialogRef<any> {
        return this.showModal(message, title, 'alert', 'info');
    }

    alertError(message, title?: string): MatDialogRef<any> {
        return this.showModal(message, title, 'alert', 'error');
    }

    alertWarn(message, title?: string): MatDialogRef<any> {
        return this.showModal(message, title, 'alert', 'warn');
    }

    confirm(message, title?: string): MatDialogRef<any> {
        return this.showModal(message, title, 'confirm');
    }

    private snack(message: string, extraClasses?: string) {
        this.snackBar.open(message, '关闭', {
            duration: 100000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            extraClasses: extraClasses
        });
    }

    private showModal(message, title: string, type: 'alert' | 'confirm', msgType?: 'error' | 'info' | 'warn'): MatDialogRef<any> {
       return this.dialog.open(MessageDialogComponent, {
            closeOnNavigation: false,
            minWidth: '350px',
            minHeight: '100px',
            disableClose: true,
            data: {
                title: title || this.formateTitle(msgType),
                content: message,
                showNoBtn: (type === 'confirm'),
                showYesBtn: true,
                noBtnText: (type === 'confirm' ? '否' : ''),
                yesBtnText: (type === 'alert' ? '关闭' : '是'),
                msgType: msgType,
                iconColor: 'jy-' + msgType
            }});
    }

    formateTitle(msgType?: 'error' | 'info' | 'warn'): string{
        switch (msgType) {
            case 'error': return '错误提示';
            case 'info': return '消息提示';
            case 'warn': return '警告提示';
            default: return '消息提示';
        }
    }
}
