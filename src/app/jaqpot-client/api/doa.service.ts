import { Injectable } from '@angular/core';
import '../rxjs-operators';
import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Doa } from '../model/doa';
import { tap, catchError, take } from 'rxjs/operators';
import { EMPTY, Observable, pipe, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class DoaApiService extends BaseClient<Doa> {
  _privateBasePath: string;
  _doaBase: string = '/doa/';

  constructor(
    http: HttpClient,
    public dialogsService: DialogsService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    super(http, dialogsService, oidcSecurityService, '/doa/');
  }

  public getDoa(hasSources: string): Observable<Doa> {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', tokenValue);
    let pathFormed = environment.jaqpotApi + this._doaBase;
    let params = new HttpParams().set('hasSources', hasSources);
    return this.http.get(pathFormed, { headers: headers, params: params }).pipe(
      tap((res: Response) => {
        return res;
      }),
      catchError((err) => this.dialogsService.onError(err)),
    );
  }

  public checkIfDoaExists(hasSources: string) {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', tokenValue);
    let pathFormed = environment.jaqpotApi + this._doaBase;
    let params = new HttpParams().set('hasSources', hasSources);
    return this.http
      .get<Response>(pathFormed, {
        headers: headers,
        params: params,
      })
      .pipe(
        catchError((err) => {
          console.warn(err);
          return EMPTY;
        }),
      );
  }
}
