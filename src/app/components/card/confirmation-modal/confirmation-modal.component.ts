import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent, boolean>
  ) {}

  darkModeService: DarkModeService = inject(DarkModeService);

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
