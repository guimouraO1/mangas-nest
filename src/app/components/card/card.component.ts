import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { NewChapterModalComponent } from './new-chapter-modal/new-chapter-modal.component';
import { ChaptersService } from '../../services/chapters.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  dialog = inject(MatDialog);
  chapterService = inject(ChaptersService);
  manga = input.required<any>();

  newChapter(mangaId: string) {
    const newChapter = this.dialog.open(NewChapterModalComponent);

    newChapter.afterClosed().subscribe((confirmed: number | boolean) => {
      if (!confirmed) return;

      this.chapterService.newChapter(+confirmed, mangaId).subscribe({
        next: (res) => {
          this.manga().chapters = [
            ...this.manga().chapters,
            {
              id: '',
              mangaId: this.manga().id,
              number: +confirmed,
            },
          ].sort((a, b) => b.number - a.number);
          if (this.manga().chapters.length > 5) {
            this.manga().chapters = this.manga().chapters.slice(0, 5);
          }
        },
        error: (res) => console.log(res),
        complete: () => console.log('Terminou!'),
      });
    });
  }

  delChapter(chapter: number, mangaId: string) {
    const deleteChapterConfirmation = this.dialog.open(
      ConfirmationModalComponent
    );
    deleteChapterConfirmation.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.chapterService.delChapter(+chapter, mangaId).subscribe({
        next: (res) => {
          this.manga().chapters = this.manga().chapters.filter(
            (ch: any) => ch.number !== +chapter
          );
        },
        error: (res) => console.log(res),
        complete: () => console.log('Terminou!'),
      });
    });
  }
}
