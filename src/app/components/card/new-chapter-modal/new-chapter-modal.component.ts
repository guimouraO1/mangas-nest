import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  chapter = signal<number>(0);
  chapterValue: any = 0;

  constructor(
    public dialogRef: MatDialogRef<NewChapterModalComponent, boolean>
  ) {
    this.chapterValue = this.chapter();
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
