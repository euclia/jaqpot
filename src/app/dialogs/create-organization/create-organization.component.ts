import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OidcSecurityService } from '../../../../node_modules/angular-auth-oidc-client';
import { Organization } from '../../jaqpot-client/model/organization';
import { PlatformLocation } from '@angular/common';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css'],
})
export class CreateOrganizationComponent {
  organization: Organization = <Organization>{};
  public hostPath: string;
  orgId: string;

  constructor(
    public dialogRef: MatDialogRef<CreateOrganizationComponent>,
    public oidcService: OidcSecurityService,
    platformLocation: PlatformLocation,
    public organizationService: OrganizationService,
    public router: Router,
  ) {
    this.hostPath = window.location.host;
  }

  createOrganization() {
    // this.organization._id = this.orgId
    // console.log(this.organization)
    // this.organizationService.postEntity(this.organization)
    //     .subscribe(orgCreated =>{
    //       var route = "/organization/" + this.organization._id
    //       this.dialogRef.close()
    //       this.router.navigate([route])
    //     }
    // )
  }
}
