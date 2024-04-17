import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-choose-x-y',
  templateUrl: './choose-x-y.component.html',
  styleUrls: ['./choose-x-y.component.css'],
})
export class ChooseXYComponent {
  data: string[];
  adminUsers: any;
  xData: string[] = [];
  yData: string[] = [];

  dataChose = {};

  constructor(public thisDialogRef: MatDialogRef<ChooseXYComponent>) {}

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  closeDialog() {
    this.dataChose['xData'] = this.xData;
    this.dataChose['yData'] = this.yData;
    return this.thisDialogRef.close(this.dataChose);
  }
}
