import { Component, OnInit } from '@angular/core';
import { startWith, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { Notification } from '../../jaqpot-client/model/notification';
import { DialogsService } from '../../dialogs/dialogs.service';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { UserService } from '../../jaqpot-client/api/user.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { ModelApiService } from '../../jaqpot-client/api/model.service';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notificationCount: number;
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private organizationService: OrganizationService,
    private userService: UserService,
    private dialogsService: DialogsService,
    private datasetService: DatasetService,
    private modelService: ModelApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (environment.notificationPolling === true) {
      interval(10000)
        .pipe(
          startWith(0),
          switchMap(() => this.notificationService.getUnreadNotifications()),
        )
        .subscribe((notifsGot) => {
          this.notifications = notifsGot;
          this.notificationService
            .countUnreadNotifications()
            .subscribe((res) => {
              this.notificationCount = res.headers.get('total');
            });
        });
    }
  }

  openNotifDialog(notif) {
    this.dialogsService.openActualNotifDialog(
      notif,
      this.organizationService,
      this.notificationService,
      this.datasetService,
      this.modelService,
      this.userService,
      'menu',
    );
  }

  viewAll() {
    this.router.navigate(['/notifications']);
  }

  handleErrorIn(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
