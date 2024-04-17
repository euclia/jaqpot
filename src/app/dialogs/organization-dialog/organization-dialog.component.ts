import { AfterViewInit, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OidcSecurityService } from '../../../../node_modules/angular-auth-oidc-client';
import { Router } from '../../../../node_modules/@angular/router';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { SessionService } from '../../session/session.service';
import { Organization } from '@euclia/accounts-client/dist/models/models';

@Component({
  selector: 'app-organization-dialog',
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.css'],
})
export class OrganizationDialogComponent implements AfterViewInit {
  organization: Organization;
  organizationService: OrganizationService;
  edit: boolean = false;
  view: boolean;

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogComponent>,
    public oidcService: OidcSecurityService,
    public router: Router,
    private sessionService: SessionService,
    // public organizationService:OrganizationService
  ) {}

  ngAfterViewInit() {
    const userData = this.sessionService.getUserData();
    if (
      userData.groups.includes('/Administrator') &&
      this.organization._id === 'Jaqpot'
    ) {
      setTimeout((_) => (this.edit = true));
    }
    if (
      this.organization.meta &&
      this.organization.creator &&
      this.organization.creator === userData.sub
    ) {
      setTimeout(() => (this.edit = true));
    }
  }

  goToOrganization() {
    var route = '/organization/' + this.organization._id;
    this.dialogRef.close();
    this.router.navigate([route]);
  }

  deleteOrganization() {
    // this.organizationService.deleteEntity(this.organization._id).subscribe(resp =>{
    //     this.dialogRef.close()
    //   }
    // )
  }
}
