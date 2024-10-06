import {
    Component,
    Inject,
    inject,
    input,
    OnInit,
    signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../services/dark-mode.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
    imports: [FormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
    standalone: true,
    selector: 'app-new-chapter-modal',
    templateUrl: './new-chapter-modal.component.html',
})
export class NewChapterModalComponent {
    darkModeService: DarkModeService = inject(DarkModeService);
    chapter = signal<number>(1);
    chapterValue: any = 0;

    constructor(
        public dialogRef: MatDialogRef<NewChapterModalComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (+this.data[0]?.number) {
            this.chapterValue = +this.data[0].number + 1;
            this.chapter.set(this.chapterValue);
        } else {
            this.chapterValue = 1;
            this.chapter.set(this.chapterValue);
        }
    }

    confirm(): void {
        this.dialogRef.close(this.chapterValue);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }

    increment(): void {
        this.chapterValue = ((+this.chapterValue || 0) + 1).toString();
    }

    decrease(): void {
        this.chapter.update((value) => (value > 0 ? value - 1 : 0));
        this.chapterValue = this.chapter();
    }

    onChapterChange(value: any): void {
        this.chapter.set(value);
    }
}
