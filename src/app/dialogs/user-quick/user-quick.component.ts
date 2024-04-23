import { Component, OnInit } from '@angular/core';
import { User } from '@euclia/accounts-client';
import { UserService } from '../../jaqpot-client/api/user.service';

@Component({
  selector: 'app-user-quick',
  templateUrl: './user-quick.component.html',
  styleUrls: ['./user-quick.component.css'],
})
export class UserQuickComponent implements OnInit {
  userApi: UserService;
  user: User;
  userToSee: User;

  constructor() {}

  ngOnInit() {
    this.userApi.getUserById(this.user._id).then((user: User) => {
      this.userToSee = user;
    });
  }
}
