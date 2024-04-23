import { Component } from '@angular/core';
import { UserService } from '../../jaqpot-client/api/user.service';
import {
  FormControl,
  Validators,
} from '../../../../node_modules/@angular/forms';
import { User } from '../../jaqpot-client';
import { NotificationFactoryService } from '../../jaqpot-client/factories/notification-factory.service';
import { Notification } from '../../jaqpot-client/model/notification';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { SessionService } from '../../session/session.service';
import { Organization } from '@euclia/accounts-client';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css'],
})
export class InviteDialogComponent {
  userService: UserService;
  notifFactory: NotificationFactoryService;
  notificationService: NotificationService;

  organization: Organization;
  notification: Notification;

  inviteMessage: string;

  username: string;
  usersTemp: Array<User> = new Array();
  users: User[] = [];
  user: User;

  addBodyB: boolean = false;

  public userInputCtrl: FormControl;

  constructor(private sessionService: SessionService) {
    this.userInputCtrl = new FormControl(
      { value: '', disabled: false },
      Validators.required,
    );
  }

  inputChanged(username: string) {
    if (username.length > 1) {
      let ids: User[] = [];
      this.users = [];
      // this.userService.searchUserByName(username)
      //   .subscribe((idsGot:User[]) => {
      //     let ids:string[] = []
      //     idsGot.forEach((u:User)=>{
      //       ids.push(u._id)
      //     })
      //     this.searchByEmail(username, ids)
      //     idsGot.forEach(e => {
      //       let user = <User>{}
      //       let tempuser = <User>{}
      //       let mius:MetaInfo = <MetaInfo>{}
      //       let miustemp:MetaInfo = <MetaInfo>{}
      //       user.meta = mius
      //       user.meta = miustemp
      //       this.userService.getPropertyWithIdSecured(e._id, "name").subscribe(username => {
      //         tempuser = username
      //         user.name = tempuser.name
      //         user._id = tempuser._id
      //       })
      //       this.userService.getPropertyWithIdSecured(e._id, "occupation").subscribe(occupation => {
      //         tempuser = occupation
      //         user.occupation = tempuser.occupation
      //       })
      //       this.userService.getPropertyWithIdSecured(e._id, "occupationat").subscribe(occupatioAt => {
      //         tempuser = occupatioAt
      //         user.occupationAt = tempuser.occupationAt
      //       })
      //       this.userService.getPropertyWithIdSecured(e._id, "picture").subscribe(profPic => {
      //         tempuser = profPic
      //         if(typeof tempuser.meta != "undefined"){
      //           user.meta.picture = tempuser.meta.picture
      //         }
      //       })
      //       this.users.push(user)
      //     })
      //   })
    }
  }

  searchByEmail(email: string, idsAllready: string[]) {
    // this.userService.searchUserEmail(email)
    // .subscribe((idsGotbyem:User[]) => {
    //   idsGotbyem.forEach((e:User) => {
    //     if(!idsAllready.includes(e._id)){
    //       let user = <User>{}
    //       let tempuser = <User>{}
    //       let mius:MetaInfo = <MetaInfo>{}
    //       let miustemp:MetaInfo = <MetaInfo>{}
    //       user.meta = mius
    //       user.meta = miustemp
    //       this.userService.getPropertyWithIdSecured(e._id, "name").subscribe(username => {
    //         tempuser = username
    //         user.name = tempuser.name
    //         user._id = tempuser._id
    //       })
    //       this.userService.getPropertyWithIdSecured(e._id, "occupation").subscribe(occupation => {
    //         tempuser = occupation
    //         user.occupation = tempuser.occupation
    //       })
    //       this.userService.getPropertyWithIdSecured(e._id, "occupationat").subscribe(occupatioAt => {
    //         tempuser = occupatioAt
    //         user.occupationAt = tempuser.occupationAt
    //       })
    //       this.userService.getPropertyWithIdSecured(e._id, "picture").subscribe(profPic => {
    //         tempuser = profPic
    //         if(typeof tempuser.meta != "undefined"){
    //           user.meta.picture = tempuser.meta.picture
    //         }
    //       })
    //       this.users.push(user)
    //     }
    //   })
    // })
  }

  invite() {
    let userToInv = <User>{};
    userToInv = this.users.find((users) => users.name === this.user);
    if (userToInv == null) {
      console.log('Canot find user');
    }
    var userData = this.sessionService.getUserData();
    // var userData = JSON.parse(sessionStorage.getItem('userData'))
    this.notification = this.notifFactory.invitationNotification(
      userData.sub,
      userToInv._id,
      this.organization._id,
    );

    if (this.addBodyB === true && this.inviteMessage != null) {
      this.notification.body = this.inviteMessage;
    }

    this.notificationService
      .postEntity(this.notification)
      .subscribe((notifGot) => {
        this.notification = notifGot;
      });
  }

  addBody() {
    this.addBodyB = true;
  }

  cancelBody() {
    this.addBodyB = false;
  }
}
