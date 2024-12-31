import {
    Component,
    inject,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../services/dark-mode.service';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    imports: [FormsModule, CommonModule, TranslateModule],
    standalone: true,
    selector: 'app-new-chapter-modal',
    templateUrl: './subscription-modal.html',
})

export class SubscritionModalConfimation {
    darkModeService: DarkModeService = inject(DarkModeService);
    constructor(public dialogRef: MatDialogRef<SubscritionModalConfimation>) { }

    rating = new FormControl(5, [Validators.required, Validators.pattern('^[1-5]$')]);

    confirm(): void {
        if (!this.rating.valid) {
            return;
        }

        this.dialogRef.close({ modal: true, rating: this.rating.value! });
    }

    onRatingChange(value: number): void {
        this.rating.setValue(value);
    }

    cancel(): void {
        this.dialogRef.close({ modal: false });
    }
}
