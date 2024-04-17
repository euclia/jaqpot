import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session/session.service';
import { Subscription } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css'],
})
export class FrontComponent implements OnInit {
  isAuthorizedSubscription: Subscription;

  constructor(
    private sessionService: SessionService,
    private oidcSecurityService: OidcSecurityService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isAuthorizedSubscription =
      this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated }) => {
          if (isAuthenticated === true) {
            this.router.navigate(['/home']);
          }
        },
      );
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  gotolab() {
    location.href = 'https://www.chemeng.ntua.gr/labs/control_lab/';
  }

  viewtut() {
    location.href = window.location + 'assets/JPQ5_TUTORIAL_NTUA.pdf';
    // this.router.navigate([window.location + '/assets/JPQ5_TUTORIAL_NTUA.pdf'])
    // const link = document.createElement('a');
    // link.setAttribute('target', '_blank');
    // link.setAttribute('href', 'abc.net/files/test.ino');
    // link.setAttribute('download', `products.csv`);
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
  }
}
