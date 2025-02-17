import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Alert, AlertType } from '../../models/notification.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { alert: Alert }) {
    this.alert = this.data.alert;
  }

  alert: Alert;
  AlertType = AlertType;
  matSnackBarRef: MatSnackBarRef<CustomSnackbarComponent> = inject(MatSnackBarRef);

}
