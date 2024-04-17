import { throwError as observableThrowError, Observable, interval } from 'rxjs';
import { Injectable } from '@angular/core';
import '../rxjs-operators';
import {
  map,
  filter,
  catchError,
  mergeMap,
  tap,
  retryWhen,
} from 'rxjs/operators';
import { Dataset } from '../model/dataset';
import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { SearchSession } from '../model/searchSession';
import { FountEntities } from '../model/fountEntities';
import { environment } from '../../../environments/environment';

@Injectable()
export class SearchApiService {
  _privateBasePath: string;
  private dataset: Dataset;
  _searchBase: string = '/search/';

  constructor(
    private http: HttpClient,
    private dialogsService: DialogsService,
    private oidcSecurityService: OidcSecurityService,
  ) {
    // super(http, dialogsService, oidcSecurityService, "/task/")
  }

  public startSearch(searchTerm: string): Observable<SearchSession> {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', tokenValue);
    let pathFormed = environment.jaqpotApi + this._searchBase;
    let params = new HttpParams().set('term', searchTerm);
    return this.http.get(pathFormed, { headers: headers, params: params }).pipe(
      tap((res: Response) => {
        return res;
      }),
      catchError((err) => this.dialogsService.onError(err)),
    );
  }

  public searchSession(
    sessionId: string,
    from: number,
    to: number,
  ): Observable<FountEntities> {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', tokenValue);
    let pathFormed = environment.jaqpotApi + this._searchBase + 'session';
    let params = new HttpParams()
      .set('session', sessionId)
      .set('from', from.toString())
      .set('to', to.toString());
    return this.http.get(pathFormed, { headers: headers, params: params }).pipe(
      tap((res: Response) => {
        return res;
      }),
      catchError((err) => this.dialogsService.onError(err)),
    );
  }
}
