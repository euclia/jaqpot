import { Component, OnInit } from '@angular/core';
import { UserService } from '../../jaqpot-client/api/user.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '@euclia/accounts-client';

@Component({
  selector: 'app-add-administrator',
  templateUrl: './add-administrator.component.html',
  styleUrls: ['./add-administrator.component.css'],
})
export class AddAdministratorComponent implements OnInit {
  userIds: string[];
  userApi: UserService;
  admins: string[];

  users: User[] = [];
  adminUsers: User[] = [];

  constructor(public thisDialogRef: MatDialogRef<AddAdministratorComponent>) {}

  ngOnInit() {
    if (typeof this.userIds != 'undefined') {
      this.userIds.forEach((id) => {
        this.userApi.getUserById(id).then((user: User) => {
          this.users.push(user);
        });
      });
    }
    if (typeof this.admins != 'undefined') {
      this.admins.forEach((id) => {
        this.userApi.getUserById(id).then((user: User) => {
          this.adminUsers.push(user);
        });
      });
    }
  }

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
    return this.thisDialogRef.close(this.adminUsers);
  }
}
