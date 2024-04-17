import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAlgorithmDialogComponent } from '../../dialogs/add-algorithm-dialog/add-algorithm-dialog.component';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.css'],
})
export class AlgorithmsComponent {
  constructor(public dialog: MatDialog) {}

  addAlgoDialog() {
    let dialogRef = this.dialog.open(AddAlgorithmDialogComponent, {});
  }
}
