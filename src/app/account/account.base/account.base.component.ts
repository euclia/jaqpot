import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SessionService } from '../../session/session.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ErrorReport } from '../../ui-models/errorReport';
import { UserService } from '../../jaqpot-client/api/user.service';
import { MetaInfo } from '../../jaqpot-client';
import { ProfilepicDialogComponent } from '../../dialogs/profilepic-dialog/profilepic-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SocialBaseComponent } from '../social.base/social.base.component';
import { CreateOrganizationComponent } from '../../dialogs/create-organization/create-organization.component';
import { User } from '@euclia/accounts-client';

@Component({
  selector: 'app-account.base',
  templateUrl: './account.base.component.html',
  styleUrls: ['./account.base.component.css'],
})
export class AccountBaseComponent implements OnInit {
  public errorReport: ErrorReport;
  public id: string;
  public username: string;

  user: User;

  public familyName: string;
  public firstName: string;
  public email: string;
  public preferedUserName: string;
  public name: string;

  public edit_name_is_disabled: boolean;
  public edit_familyname_is_disabled: boolean;
  public edit_firstyname_is_disabled: boolean;
  public edit_preferedname_is_disabled: boolean;

  public photo_unavail: boolean = true;

  public edit: boolean = true;

  public urlForm: FormGroup;

  @ViewChild(SocialBaseComponent) userForS;

  constructor(
    public dialog: MatDialog,
    private sessionService: SessionService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private oidcSecurityService: OidcSecurityService,
  ) {
    this.username = this.sessionService.get('userName');
    var userData = this.sessionService.getUserData();
    this.name = userData.name;
    this.familyName = userData.family_name;
    this.firstName = userData.given_name;
    this.email = userData.email;
    this.preferedUserName = userData.preferred_username;
    this.edit_name_is_disabled = true;
    this.edit_familyname_is_disabled = true;
    this.edit_firstyname_is_disabled = true;
    this.edit_preferedname_is_disabled = true;
    this.id = userData.sub;
    this.urlForm = new FormGroup({
      url: new FormControl({ value: '', disabled: true }, Validators.required),
      title: new FormControl(),
      description: new FormControl(),
    });
  }

  ngOnInit() {
    this.userService.getUserById(this.id).then((userGot: User) => {
      this.user = userGot;
      if (typeof userGot.meta != 'undefined') {
        if (userGot.meta.picture == null) {
          this.photo_unavail = true;
        } else {
          this.photo_unavail = false;
        }
      }
    });
  }

  addProfilePicDialog() {
    // let dialogRef = this.dialog.open(ProfilepicDialogComponent,{})
    // dialogRef.afterClosed().subscribe(result => {
    //   if(typeof result != 'undefined'){
    //     this.user.meta = <MetaInfo>{};
    //     this.user.meta.picture = result;
    //     this.userService.updateUserById(this.id, this.user)
    //     .subscribe(userGot =>{
    //       this.user = userGot;
    //       if(this.user.meta.picture == null){
    //         this.photo_unavail = true;
    //       }else{
    //         this.photo_unavail = false;
    //       }
    //     })
    //   }});
    //   this.userService.getUserById(this.sessionService.getUserId()).subscribe((userGot:User)=>{
    //     this.user = userGot
    //   })
  }

  editForm() {
    this.edit = false;
    this.urlForm.enable();
  }

  saveForm() {
    // this.edit = true;
    // this.urlForm.disable();
    // this.userService.updateUserById(this.id, this.user)
    // .subscribe(userGot =>{
    //   this.user = userGot;
    // })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3200,
    });
  }

  onUpdated(user) {
    // this.userService.updateUserById(user.id, user)
    // .subscribe(userGot =>{
    //   this.user = userGot;
    //   if(this.user.meta.picture == null){
    //     this.photo_unavail = true;
    //   }else{
    //     this.photo_unavail = false;
    //   }
    // });
  }

  onDialogClose() {
    // window.location.reload();
  }

  createOrganization() {
    let dialogRef = this.dialog.open(CreateOrganizationComponent, {});
  }
}
