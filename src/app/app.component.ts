import { Component, OnInit } from '@angular/core';
import { DialogsService } from './dialogs/dialogs.service';
import { LoginDialogComponent } from './dialogs/login-logout-dialog/login-dialog.component';
import { LogoutDialogComponent } from './dialogs/login-logout-dialog/logout-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from './session/session.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDarkTheme: boolean;
  loggedIn: boolean;
  subscription: Subscription;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  isAuthenticated$: Observable<boolean>;
  checkSessionChanged$: Observable<boolean>;
  private userData$: Observable<UserDataResult>;

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
          if (isAuthenticated) {
            this.isAuthorized = true;
            this.loggedIn = true;
            this.userData$.subscribe((userDataResult) => {
              if (userDataResult) {
                this.sessionService.setUserData(userDataResult);

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

  openLoginDialog() {
    let dialogRef = this.dialog.open(LoginDialogComponent, {});
  }

  openLogoutDialog() {
    let dialogRef = this.dialog.open(LogoutDialogComponent, {});
  }

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
