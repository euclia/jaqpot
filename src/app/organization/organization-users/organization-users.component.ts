import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../jaqpot-client/api/user.service';
import { OidcSecurityService } from '../../../../node_modules/angular-auth-oidc-client';
import { DialogsService } from '../../dialogs/dialogs.service';
import { NotificationFactoryService } from '../../jaqpot-client/factories/notification-factory.service';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { SessionService } from '../../session/session.service';
import { User } from '@euclia/accounts-client';
import { Meta } from '@euclia/accounts-client';
import { Organization } from '@euclia/accounts-client';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.css'],
})
export class OrganizationUsersComponent implements OnInit {
  @Input() organization: Organization;
  users: Array<User> = new Array();
  userIds: Array<string> = new Array();
  totalUsers: Number;
  caninvite = false;

  constructor(
    public userService: UserService,
    public notifFactory: NotificationFactoryService,
    public notificationService: NotificationService,
    public dialogsService: DialogsService,
    private sessionService: SessionService,
    public oidcService: OidcSecurityService,
  ) {}

  ngOnInit() {
    if (this.organization._id != 'Jaqpot') {
      var userData = this.sessionService.getUserData();

      if (
        this.organization.creator.includes(userData.sub) ||
        this.organization.users.includes(userData.sub)
      ) {
        this.caninvite = true;
      }

      this.userIds = this.organization.users;
      let user: User = <User>{};

      this.userIds.forEach((id) => {
        let userFormed: User = <User>{};
        let metaInfo: Meta = <Meta>{};
        userFormed._id = id;
        userFormed.meta = metaInfo;
        this.userService.getUserById(id).then((userGot) => {
          user = userGot;
          if (user.meta != null && user.meta.picture != null) {
            userFormed.meta.picture = user.meta.picture;
          }
          userFormed.occupation = user.occupation;
          userFormed.occupationAt = user.occupationAt;
          userFormed.name = user.name;
          this.users.push(userFormed);
        });
      });
    }
  }

  openInviteDialog() {
    this.dialogsService.inviteToOrganization(
      this.userService,
      this.notifFactory,
      this.organization,
      this.notificationService,
    );
  }

  openUserDialog(user) {
    this.dialogsService.quickUser(this.userService, user);
  }
}
