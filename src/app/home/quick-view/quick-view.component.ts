import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ViewItem } from '../data-model-view/data-model-view.component';
import { DialogsService } from '../../dialogs/dialogs.service';
import { UserService } from '../../jaqpot-client/api/user.service';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { User } from '@euclia/accounts-client/dist/models/user';
import { Organization } from '@euclia/accounts-client/dist/models/models';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css'],
})
export class QuickViewComponent implements OnChanges {
  @Input() viewItem: ViewItem;

  user: User;
  org: Organization;
  orgs: Organization[] = [];

  owner: User;

  constructor(
    private dialogsService: DialogsService,
    private userApi: UserService,
    private orgsApi: OrganizationService,
  ) {}

  ngOnChanges() {
    this.orgs = [];
    if (typeof this.viewItem != 'undefined') {
      this.userApi
        .getUserById(this.viewItem.meta.creators[0])
        .then((user: User) => {
          this.owner = user;
        });
    }
    // if(typeof this.viewItem !='undefined' && typeof this.viewItem.meta.read != 'undefined' && this.viewItem.meta.read.length > 0 ){
    //   this.viewItem.meta.read.forEach(orgId=>{
    //     this.orgsApi.getOrgById(orgId).then((org:Organization)=>{
    //       this.orgs.push(org)
    //     })
    //   })
    // }
  }

  openUser() {
    this.dialogsService.quickUser(this.userApi, this.owner);
  }

  openOrg(org) {
    this.dialogsService.onOrganizationView(org, this.orgsApi, true);
  }
}
