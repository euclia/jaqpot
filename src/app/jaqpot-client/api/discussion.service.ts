import { Injectable } from '@angular/core';
import { BaseClient } from './base.client';
import { Discussion } from '../model/discussion';
import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class DiscussionService extends BaseClient<Discussion> {
  private readonly _privateBasePath: string;

  private _discussionBase: string;

  constructor(
    public http: HttpClient,
    public dialogsService: DialogsService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    super(http, dialogsService, oidcSecurityService, '/discussion/');
    this._privateBasePath = environment.jaqpotApi;
    this._discussionBase = this._privateBasePath + '/user/';
  }
}
