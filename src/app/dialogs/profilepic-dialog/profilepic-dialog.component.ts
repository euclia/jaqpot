import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profilepic-dialog',
  templateUrl: './profilepic-dialog.component.html',
  styleUrls: ['./profilepic-dialog.component.css'],
})
export class ProfilepicDialogComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  loadImageFailed: any = '';
  cropperReady = false;

  saveDisactivated = true;

  constructor(
    @Optional() public dialogRef: MatDialogRef<ProfilepicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public profPic: string,
  ) {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCroppedBase64(image: string) {
    this.croppedImage = image;
    this.saveDisactivated = false;
  }

  imageLoaded() {
    this.cropperReady = true;
  }

  imageLoadFailed() {
    console.log('Load failed');
  }

  onCloseConfirm() {
    this.dialogRef.close(this.croppedImage);
  }
}
