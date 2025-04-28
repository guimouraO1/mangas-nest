import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../services/theme.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'subscribe-modal',
    imports: [CommonModule, TranslateModule],
    templateUrl: './subscribe-modal.component.html'
})
export class SubscribeModalComponent {
    dialogRef = inject(DialogRef);
    themeService = inject(ThemeService);

    rating = new FormControl(5, [Validators.required, Validators.pattern('^[1-5]$')]);

    onRatingChange(value: number): void {
        this.rating.setValue(value);
    }

    closeDialog(response: boolean = false) {
        this.dialogRef.close({ result: response, rating: this.rating.value });
    }
}
