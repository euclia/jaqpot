import { AfterViewInit, Component, Inject } from '@angular/core';
import { DialogsService } from './dialogs/dialogs.service';
import { FormControl, Validators } from '@angular/forms';
import { OnInit, OnDestroy } from '@angular/core';
import { Credentials } from './ui-models/credentials';
import { LoginDialogComponent } from './dialogs/login-logout-dialog/login-dialog.component';
import { LogoutDialogComponent } from './dialogs/login-logout-dialog/logout-dialog.component';
// import { AccountDialogComponent } from './dialogs/account-dialog/account-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from './session/session.service';
import { Subscription, Observable } from 'rxjs';
import { element } from 'protractor';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import {
  OidcSecurityService,
  OidcClientNotification,
} from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

// import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isDarkTheme: boolean;
  loggedIn: boolean;
  subscription: Subscription;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  userData$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  checkSessionChanged$: Observable<boolean>;
  checkSessionChanged: any;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public dialog: MatDialog,
    public dialogsService: DialogsService,
    public sessionService: SessionService,
    private router: Router,
  ) {
    var theme = sessionService.get('theme');
    if (theme === 'dark-theme') {
      this.isDarkTheme = true;
    } else {
      this.isDarkTheme = false;
    }

    this.subscription = this.sessionService.getTheme().subscribe((theme) => {
      var the = (<any>Object).values(theme);
      if (the[0] === 'default-theme') {
        this.isDarkTheme = false;
      } else {
        this.isDarkTheme = true;
      }
    });
  }

  ngOnInit() {
    this.userData$ = this.oidcSecurityService.userData$;
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$.pipe(
      map((result) => result.isAuthenticated),
    );
    this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

    this.oidcSecurityService
      .checkAuth()
      .subscribe((isAuthenticated) =>
        console.log('app authenticated', isAuthenticated),
      );
    this.isAuthorizedSubscription =
      this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated }) => {
          if (isAuthenticated === true) {
            this.isAuthorized = true;
            this.loggedIn = true;
            this.userData$.subscribe((d) => {
              if (d) {
                this.sessionService.setUserData(d);

                if (localStorage.getItem('goToModel')) {
                  var modelId = localStorage.getItem('goToModel');
                  let model_url = '/model/' + modelId;
                  // this.router.navigate([model_url])
                  window.location.assign(model_url);
                }
              }
            });
          } else {
            this.isAuthorized = false;
            this.loggedIn = false;
          }
        },
      );
  }

  ngOnDestroy(): void {
    // this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  openLoginDialog() {
    let dialogRef = this.dialog.open(LoginDialogComponent, {});
  }

  openLogoutDialog() {
    let dialogRef = this.dialog.open(LogoutDialogComponent, {});
  }

  // openAccountDialog(){
  //   let dialogRef = this.dialog.open(AccountDialogComponent,{
  //     height: '100%',
  //     width: '100%',
  //     maxHeight:'100%',
  //     maxWidth:'100%',
  //     panelClass: 'account_dialog'
  //   });
  // }

  changeTheme(): void {
    if (this.isDarkTheme === true) {
      this.sessionService.set('theme', 'default-theme');
    } else {
      this.sessionService.set('theme', 'dark-theme');
    }
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  openAccounts(): void {
    this.dialogsService.manageAccounts().subscribe((res) => {
      if (res === 'LOGOUT') {
        this.oidcSecurityService.logoff();
      }
    });
  }

  // private doCallbackLogicIfRequired() {
  //   if (window.location.hash) {
  //     this.oidcSecurityService.authorizedCallback();
  //   }
  // }
}
