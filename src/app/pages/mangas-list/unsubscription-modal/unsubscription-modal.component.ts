import {
    Component,
    inject,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../services/dark-mode.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    imports: [FormsModule, CommonModule, TranslateModule],
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
