import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { NotificationFactoryService } from '../../jaqpot-client/factories/notification-factory.service';
import { SessionService } from '../../session/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Organization } from '@euclia/accounts-client/dist/models/models';

@Component({
  selector: 'app-affiliations-dialog',
  templateUrl: './affiliations-dialog.component.html',
  styleUrls: ['./affiliations-dialog.component.css']
})
export class AffiliationsDialogComponent implements OnInit {

  organizationApi:OrganizationService;
  notificationApi:NotificationService;
  notificationFactory:NotificationFactoryService;
  fromOrg:string;

  organizations:Organization[] = []
  orgsearch:string;

  addBodyB:boolean;
  requestMessage:string;

  orgActivated:string;

  constructor(
    private sessionService:SessionService,
    public snackBar: MatSnackBar
  ) {  }

  ngOnInit() {
  }

  inputChanged(orgname: string) {
    // if(orgname.length > 1){
    //   this.organizations = []
    //   this.organizationApi.searchOrgById(orgname).subscribe((orgs:Organization[])=>{
    //     if(orgs.length > 0){
    //       orgs.forEach((org:Organization)=>{
    //         this.organizationApi.getWithIdSecured(org._id).subscribe((org:Organization) =>{
    //           if(org._id != this.fromOrg ){
    //             this.organizations.push(org)
    //           }
    //         })
    //       })
    //     }
    //   })
    // }
  }


  request(){
    this.organizationApi.getOrgById(this.orgsearch).then((orgToRequest:Organization) =>{
      let userData = this.sessionService.getUserData()
      let notif = this.notificationFactory.affiliationNotification(userData.sub, orgToRequest.creator[0], this.fromOrg, this.orgsearch, this.requestMessage)
      this.notificationApi.postEntity(notif).subscribe((not:Notification)=>{
        this.openSnackBar("Affiliation request created", "Ok");
      })
    })
  }

  addBody(){
    this.addBodyB = true;
  }

  cancelBody(){
    this.addBodyB = false;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3200,
    });
  }

}

