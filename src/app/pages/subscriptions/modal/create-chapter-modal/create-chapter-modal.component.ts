import { Component, Inject, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../services/theme.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'create-chapter-modal',
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, NgxMaskDirective],
    templateUrl: './create-chapter-modal.component.html'
})
export class CreateChapterModalComponent {
    protected readonly toast = toast;
    dialogRef = inject(DialogRef);
    themeService = inject(ThemeService);

    chapter = new FormControl(0, [Validators.required]);

    constructor(@Inject(DIALOG_DATA) public chapterInput: number) {
        this.chapter.setValue(chapterInput);
    }

    closeDialog(response: boolean = false) {
        if(response && this.chapter.invalid) {
            toast.error('Please fill all required filds');
            return;
        }

        this.dialogRef.close({ result: response, chapter: this.chapter.value });
    }
}
