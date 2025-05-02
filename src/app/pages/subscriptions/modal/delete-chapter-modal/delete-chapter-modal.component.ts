import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../services/theme.service';
import { ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'delete-chapter-modal',
    imports: [CommonModule, TranslateModule, ReactiveFormsModule],
    templateUrl: './delete-chapter-modal.component.html'
})
export class DeleteChapterModalComponent {
    protected readonly toast = toast;
    dialogRef = inject(DialogRef);
    themeService = inject(ThemeService);

    closeDialog(response: boolean = false) {
        this.dialogRef.close(response);
    }
}
