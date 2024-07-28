import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Alert, AlertType } from '../../models/notification.model';

@Component({
  standalone: true,
  imports: [MatIconModule],
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
})
export class CustomSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { alert: Alert }) {}
  alert: Alert | undefined;
  AlertType = AlertType;
  matSnackBarRef: MatSnackBarRef<CustomSnackbarComponent> =
    inject(MatSnackBarRef);

  ngOnInit(): void {
    this.alert = this.data.alert;
  }
  closeSnackbar(): void {
    this.matSnackBarRef.dismiss();
  }
}
