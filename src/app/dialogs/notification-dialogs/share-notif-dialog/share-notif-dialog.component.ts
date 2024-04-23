import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../jaqpot-client/model/notification';
import { OrganizationService } from '../../../jaqpot-client/api/organization.service';
import { NotificationService } from '../../../jaqpot-client/api/notification.service';
import { UserService } from '../../../jaqpot-client/api/user.service';
import { ModelService } from '../../../jaqpot-client/api/model.service';
import { DatasetService } from '../../../jaqpot-client/api/dataset.service';
import { MetaInfo, Dataset, Model } from '../../../jaqpot-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '@euclia/accounts-client';
import { Organization } from '@euclia/accounts-client';

@Component({
  selector: 'app-share-notif-dialog',
  templateUrl: './share-notif-dialog.component.html',
  styleUrls: ['./share-notif-dialog.component.css'],
})
export class ShareNotifDialogComponent implements OnInit {
  _notification: Notification;
  _organizationApi: OrganizationService;
  _notificationApi: NotificationService;
  _userApi: UserService;
  _modelApi: ModelService;
  _datasetApi: DatasetService;

  openedFrom: string;

  from: User;
  organ: Organization;
  entityMeta: MetaInfo;

  constructor(
    public snackBar: MatSnackBar,
    private _router: Router,
    public dialogRef: MatDialogRef<ShareNotifDialogComponent>,
  ) {}

  ngOnInit() {
    this._userApi.getUserById(this._notification.from).then((user: User) => {
      this.from = user;
    });
    this._organizationApi
      .getOrgById(this._notification.organizationShared)
      .then((org: Organization) => {
        this.organ = org;
      });
    if (this._notification.entityShared.split('/')[0] === 'dataset') {
      this._datasetApi
        .getWithIdSecured(this._notification.entityShared.split('/')[1])
        .subscribe((data: Dataset) => {
          this.entityMeta = data.meta;
        });
    }
    if (this._notification.entityShared.split('/')[0] === 'model') {
      this._modelApi
        .getWithIdSecured(this._notification.entityShared.split('/')[1])
        .subscribe((model: Model) => {
          this.entityMeta = model.meta;
        });
    }
  }

  goToEntity() {
    this._router.navigate([this._notification.entityShared]);
  }

  resolveNotification() {
    this._notification.viewed = true;
    this._notificationApi
      .putEntitySecured(this._notification)
      .subscribe((notifNew) => {
        this.openSnackBar("Notification won't appear any more", '');
      });
  }

  deleteNotification() {
    this._notificationApi
      .deleteEntityWithID(this._notification._id)
      .subscribe((notifNew) => {
        this.dialogRef.close('deleted');
        this.openSnackBar('Notification deleted', '');
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3200,
    });
  }
}
