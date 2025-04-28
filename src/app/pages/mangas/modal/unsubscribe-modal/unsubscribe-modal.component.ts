import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../services/theme.service';

@Component({
    selector: 'unsubscribe-modal',
    imports: [CommonModule, TranslateModule],
    templateUrl: './unsubscribe-modal.component.html'
})
export class UnsubscribeModalComponent {
    dialogRef = inject(DialogRef);
    themeService = inject(ThemeService);

    closeDialog(response: boolean = false) {
        this.dialogRef.close(response);
    }
}
