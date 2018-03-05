import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MessageService } from './message.service';
import { MessageDialogComponent } from './dialog.compoment';
import { MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [MessageDialogComponent],
    imports: [ MatSnackBarModule, MatDialogModule, MatButtonModule, CommonModule, MatIconModule],
    exports: [MatSnackBarModule],
    providers: [MessageService],
    entryComponents: [MessageDialogComponent]
})
export class MessageModule {}