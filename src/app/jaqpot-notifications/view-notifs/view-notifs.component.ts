import { Component, Input } from '@angular/core';
import { Notification } from '../../jaqpot-client/model/notification';
import { DialogsService } from '../../dialogs/dialogs.service';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { ModelService } from '../../jaqpot-client/api/model.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { UserService } from '../../jaqpot-client/api/user.service';

@Component({
  selector: 'app-view-notifs',
  templateUrl: './view-notifs.component.html',
  styleUrls: ['./view-notifs.component.css'],
})
export class ViewNotifsComponent {
  @Input() notifications_to_view: Notification[];
  @Input() category: string;

  @Input() loading: boolean;

  constructor(
    private dialogsService: DialogsService,
    private organizationService: OrganizationService,
    private notificationService: NotificationService,
    private datasetService: DatasetService,
    private modelService: ModelService,
    private userService: UserService,
  ) {}

  openNotifDialog(notif) {
    this.dialogsService
      .openActualNotifDialog(
        notif,
        this.organizationService,
        this.notificationService,
        this.datasetService,
        this.modelService,
        this.userService,
        'viewAll',
      )
      .subscribe((res) => {
        if (typeof res != 'undefined' && res === 'deleted') {
          let ind = this.notifications_to_view.indexOf(notif);
          this.notifications_to_view.splice(ind, 1);
        }
      });
  }
}
