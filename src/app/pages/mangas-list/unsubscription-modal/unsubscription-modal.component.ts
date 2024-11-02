import {
    Component,
    inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../services/dark-mode.service';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
    imports: [FormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
    standalone: true,
    selector: 'unsubscription-modal',
    templateUrl: './unsubscription-modal.html',
})

export class UnSubscritionModalConfimation {
    darkModeService: DarkModeService = inject(DarkModeService);
    constructor(public dialogRef: MatDialogRef<UnSubscritionModalConfimation>) { }

    confirm(): void {
        this.dialogRef.close(true);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}
