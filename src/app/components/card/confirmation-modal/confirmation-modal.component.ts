import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  darkModeService: DarkModeService = inject(DarkModeService);
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent, boolean>) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
