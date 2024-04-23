import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../jaqpot-client';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { UserService } from '../../jaqpot-client/api/user.service';
import { Organization } from '@euclia/accounts-client';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit {
  organization: Organization;

  organizations: Array<Organization> = new Array<Organization>();
  @Input() user: User;
  @Output() dialogClosed = new EventEmitter<boolean>();

  constructor(
    public organizationService: OrganizationService,
    public dialogService: DialogsService,
    public userService: UserService,
  ) {}

  ngOnInit() {
    this.user.organizations.forEach((org) => {
      this.organizationService.getOrgById(org).then((organ) => {
        this.organizations.push(organ);
      });
    });
  }

  onOrgClicked(organization: Organization) {
    this.dialogService
      .onOrganizationView(organization, this.organizationService, true)
      .subscribe((result) => {
        this.dialogClosed.emit(true);
      });
  }
}
