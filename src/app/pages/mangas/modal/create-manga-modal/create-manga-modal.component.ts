import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../services/theme.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeekDaysType } from '../../../../models/manga.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'create-manga-modal',
    imports: [CommonModule, TranslateModule, ReactiveFormsModule],
    templateUrl: './create-manga-modal.component.html'
})
export class CreateMangaModalComponent {
    protected readonly toast = toast;
    dialogRef = inject(DialogRef);
    themeService = inject(ThemeService);

    createMangaForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.min(3)]),
        about: new FormControl(''),
        url: new FormControl('', [Validators.required]),
        date: new FormControl<WeekDaysType | ''>('', [Validators.required])
    });

    closeDialog(response: boolean = false) {
        if(response && this.createMangaForm.invalid) {
            toast.error('Please fill all required filds');
            return;
        }

        this.dialogRef.close({ result: response, manga: this.createMangaForm.value });
    }
}
