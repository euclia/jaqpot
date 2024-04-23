import { Component, Inject, Optional } from '@angular/core';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { UserService } from '../../jaqpot-client/api/user.service';
import { ModelService } from '../../jaqpot-client/api/model.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-photo',
  templateUrl: './update-photo.component.html',
  styleUrls: ['./update-photo.component.css'],
})
export class UpdatePhotoComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  loadImageFailed: any = '';
  cropperReady = false;

  datasetApi: DatasetService;
  userApi: UserService;
  modelApi: ModelService;

  saveDisactivated = true;

  constructor(
    @Optional() public dialogRef: MatDialogRef<UpdatePhotoComponent>,
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
