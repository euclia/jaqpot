import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../jaqpot-client/api/notification.service';
import { OrganizationService } from '../../../jaqpot-client/api/organization.service';
import { UserService } from '../../../jaqpot-client/api/user.service';
import { Notification } from '../../../jaqpot-client/model/notification';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@euclia/accounts-client';
import { Organization } from '@euclia/accounts-client';

@Component({
  selector: 'app-invitation-notif-dialog',
  templateUrl: './invitation-notif-dialog.component.html',
  styleUrls: ['./invitation-notif-dialog.component.css'],
})
export class InvitationNotifDialogComponent implements OnInit {
  notification: Notification;

  notificationService: NotificationService;
  organizationService: OrganizationService;
  userService: UserService;

  openedFrom: string;

  from: User;
  me: User;

  organ: Organization;

  constructor(
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<InvitationNotifDialogComponent>,
  ) {}

  ngOnInit() {
    this.userService.getUserById(this.notification.from).then((user) => {
      this.from = user;
    });

    this.organizationService
      .getOrgById(this.notification.invitationTo)
      .then((organization) => {
        this.organ = organization;
      });
  }

  acceptInvitation() {
    // this.userService.getUserById(this.notification.owner).then(user => {
    //   this.me = user
    //   if(!this.me.organizations.some(c => c === this.organ._id)){
    //     this.me.organizations.push(this.organ._id)
    //     this.userService.putWithIdSecured(this.me._id, this.me).subscribe(userUpdated => {
    //       this.me = userUpdated
    //       this.organ.userIds.push(this.me._id)
    //       this.organizationService.putEntitySecured(this.organ).subscribe(organUpdated => {
    //         this.openSnackBar("You are now a member of the Organization" + this.organ._id, "Congrats!")
    //       })
    //       this.notification.viewed = true;
    //       this.notificationService.putEntitySecured(this.notification).subscribe(notif =>{
    //       })
    //     })
    //   }else{
    //     this.notification.viewed = true;
    //     this.notificationService.putEntitySecured(this.notification).subscribe(notif =>{
    //       this.openSnackBar("Seems to be allready a member of this organization", "Notification Resolved")
    //     })
    //   }
    // })
  }

  declineInvitation() {
    this.notification.viewed = true;
    this.notificationService
      .putEntitySecured(this.notification)
      .subscribe((notif) => {
        this.openSnackBar(
          'You have declined invitation',
          'Notification Resolved',
        );
      });
  }

  resolveNotification() {
    this.notification.viewed = true;
    this.notificationService
      .putEntitySecured(this.notification)
      .subscribe((notifNew) => {
        this.openSnackBar("Notification won't appear any more", '');
      });
  }

  deleteNotification() {
    this.notificationService
      .deleteEntityWithID(this.notification._id)
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
