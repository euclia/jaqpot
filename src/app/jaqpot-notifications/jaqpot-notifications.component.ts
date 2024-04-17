import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../jaqpot-client/api/notification.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-jaqpot-notifications',
  templateUrl: './jaqpot-notifications.component.html',
  styleUrls: ['./jaqpot-notifications.component.css'],
})
export class JaqpotNotificationsComponent implements OnInit {
  notifications_to_view = [];

  loading: boolean = true;
  category: string = 'Invitation';
  total: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _notificationApi: NotificationService) {}

  ngOnInit() {
    this.loading = true;
    this._notificationApi
      .getNotifsByCategory('INVITATIONS', 0, 20)
      .subscribe((res) => {
        this.notifications_to_view = res;
        this.paginator.pageSize = 20;
        this.paginator.pageIndex = 0;
        this._notificationApi
          .countNotifsByCategory('INVITATIONS', 0, 0)
          .subscribe((res) => {
            this.total = res.headers.get('total');
            this.paginator.length = this.total;
          });
        this.loading = false;
      });
  }

  openInvitations() {
    this.category = 'Invitation';
    this.loading = true;
    this._notificationApi
      .getNotifsByCategory('INVITATIONS', 0, 20)
      .subscribe((res) => {
        this.notifications_to_view = res;
        this._notificationApi
          .countNotifsByCategory('INVITATIONS', 0, 0)
          .subscribe((res) => {
            this.total = res.headers.get('total');
          });
      });
    this.loading = false;
    if (typeof this.paginator != 'undefined') {
      this.paginator.firstPage();
    }
  }

  openAffiliations(event) {
    this.category = 'Affiliation requests';
    this.loading = true;
    this._notificationApi
      .getNotifsByCategory('AFFILIATIONS', 0, 20)
      .subscribe((res) => {
        this.notifications_to_view = res;
        this._notificationApi
          .countNotifsByCategory('AFFILIATIONS', 0, 0)
          .subscribe((res) => {
            this.total = res.headers.get('total');
          });
      });
    this.loading = false;
    if (typeof this.paginator != 'undefined') {
      this.paginator.firstPage();
    }
  }

  openShares(event) {
    this.category = 'Shared';
    this.loading = true;
    this._notificationApi
      .getNotifsByCategory('SHARES', 0, 20)
      .subscribe((res) => {
        this.notifications_to_view = res;
        this._notificationApi
          .countNotifsByCategory('SHARES', 0, 0)
          .subscribe((res) => {
            this.total = res.headers.get('total');
          });
      });
    this.loading = false;
    if (typeof this.paginator != 'undefined') {
      this.paginator.firstPage();
    }
  }

  onPaginateChange(event) {
    this.loading = true;
    if (this.category === 'Invitation') {
      let start: number = event.pageIndex * event.pageSize;
      let max: number = event.pageIndex * event.pageSize + event.pageSize;
      this._notificationApi
        .getNotifsByCategory('INVITATIONS', Number(start), Number(max))
        .subscribe((res) => {
          this.notifications_to_view = res;
          this._notificationApi
            .countNotifsByCategory('INVITATIONS', 0, 0)
            .subscribe((res) => {
              this.total = res.headers.get('total');
            });
        });
    }
    if (this.category === 'Shared') {
      let start: number = event.pageIndex * event.pageSize;
      let max: number = event.pageIndex * event.pageSize + event.pageSize;
      this._notificationApi
        .getNotifsByCategory('SHARES', Number(start), Number(max))
        .subscribe((res) => {
          this.notifications_to_view = res;
          this._notificationApi
            .countNotifsByCategory('SHARES', 0, 0)
            .subscribe((res) => {
              this.total = res.headers.get('total');
            });
        });
    }
    if (this.category === 'Affiliation requests') {
      let start: number = event.pageIndex * event.pageSize;
      let max: number = event.pageIndex * event.pageSize + event.pageSize;
      this._notificationApi
        .getNotifsByCategory('AFFILIATIONS', Number(start), Number(max))
        .subscribe((res) => {
          this.notifications_to_view = res;
          this._notificationApi
            .countNotifsByCategory('AFFILIATIONS', 0, 0)
            .subscribe((res) => {
              this.total = res.headers.get('total');
            });
        });
    }
    this.loading = false;
  }
}
