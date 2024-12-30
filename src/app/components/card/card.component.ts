import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ChaptersService } from '../../services/chapters.service';
import { NewChapterModalComponent } from './new-chapter-modal/new-chapter-modal.component';
import { Subscription } from '../../models/subscriptions.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})

export class CardComponent {
  dialog = inject(MatDialog);
  chapterService = inject(ChaptersService);
  subscription = input.required<Subscription>();

  url = environment.urlImages;

  async newChapter(subscriptionId: string) {
    const newChapter = this.dialog.open(NewChapterModalComponent, {data: this.subscription().chapters});

    newChapter.afterClosed().subscribe(async (confirmed: number | boolean) => {
      if (!confirmed) return;
      
      await firstValueFrom(this.chapterService.createChapter(+confirmed, subscriptionId)).catch();
    
      this.subscription().chapters = [...this.subscription().chapters,{id: '', mangaId: this.subscription().id, number: +confirmed}].sort((a, b) => b.number - a.number);
      if (this.subscription().chapters.length > 5) {
        this.subscription().chapters = this.subscription().chapters.slice(0, 5);
      }
    });
  }

  deleteChapter(chapter: number, subscriptionId: string) {
    const deleteChapterConfirmation = this.dialog.open(ConfirmationModalComponent);

    deleteChapterConfirmation.afterClosed().subscribe(async (confirmed: boolean) => {
      if (!confirmed) return;

      await firstValueFrom(this.chapterService.deleteChapter(+chapter, subscriptionId)).catch();

      this.subscription().chapters = this.subscription().chapters.filter((ch: any) => ch.number !== +chapter);
    });
  }
}
