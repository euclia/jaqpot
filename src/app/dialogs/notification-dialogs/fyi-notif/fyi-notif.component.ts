import { Component } from '@angular/core';
import { OrganizationService } from '../../../jaqpot-client/api/organization.service';
import { NotificationService } from '../../../jaqpot-client/api/notification.service';
import { UserService } from '../../../jaqpot-client/api/user.service';
import { ModelService } from '../../../jaqpot-client/api/model.service';
import { DatasetService } from '../../../jaqpot-client/api/dataset.service';
import { Notification } from '../../../jaqpot-client/model/notification';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fyi-notif',
  templateUrl: './fyi-notif.component.html',
  styleUrls: ['./fyi-notif.component.css'],
})
export class FyiNotifComponent {
  _notification: Notification;
  _organizationApi: OrganizationService;
  _notificationApi: NotificationService;
  _userApi: UserService;
  _modelApi: ModelService;
  _datasetApi: DatasetService;

  openedFrom: string;

  constructor(public snackBar: MatSnackBar) {}

  resolveNotification() {
    this._notification.viewed = true;
    this._notificationApi
      .putEntitySecured(this._notification)
      .subscribe((notifNew) => {
        this.openSnackBar("Notification won't appear any more", '');
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3200,
    });
  }
}
