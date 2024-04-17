import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  confirmationMessage: string;
  confirmationAction: string;

  constructor(
    public thisDialogRef: MatDialogRef<ConfirmationDialogComponent>,
  ) {}
  onCloseConfirm() {
    this.thisDialogRef.close(true);
  }

  onCloseCancel() {
    this.thisDialogRef.close(false);
  }
}
