import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import '../rxjs-operators';
import { catchError, tap } from 'rxjs/operators';
import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MetaInfo, Model, Task } from '../model/models';
import { environment } from '../../../environments/environment';

interface CurrentModel {
  modelId: string;
  entityId: string;
  model: Model;
}

@Injectable()
export class ModelApiService extends BaseClient<Model> {
  _privateBasePath: string;
  _modelBase = '/model/';
  private currentModelSubject = new ReplaySubject<CurrentModel>(1);
  currentModel$ = this.currentModelSubject.asObservable();

  constructor(
    http: HttpClient,
    public sessionService: SessionService,
    public dialogsService: DialogsService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    super(http, dialogsService, oidcSecurityService, '/model/');
  }

  public putMeta(model: Model): Observable<MetaInfo> {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', tokenValue);
    const pathFormed =
      environment.jaqpotApi + this._modelBase + model._id + '/meta';
    return this.http.put(pathFormed, model, { headers: headers }).pipe(
      tap((res: Response) => {
        return res;
      }),
      catchError((err) => this.dialogsService.onError(err)),
    );
  }

  public predict(
    modelId: string,
    datasetUri: string,
    visible,
    doa: boolean,
  ): Observable<Task> {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', tokenValue);
    const pathFormed = environment.jaqpotApi + this._modelBase + modelId;
    let body = new HttpParams();
    body = body.set('dataset_uri', datasetUri);
    body = body.set('visible', visible);
    body = body.set('doa', doa.toString());
    return this.http
      .post(pathFormed, body.toString(), { headers: headers })
      .pipe(
        tap((res: Response) => {
          return res;
        }),
        catchError((err) => this.dialogsService.onError(err)),
      );
  }

  public updateOnTrash(modelId: string, model: Model): Observable<Model> {
    const token = this.oidcSecurityService.getAccessToken();
    const tokenValue = 'Bearer ' + token;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', tokenValue);
    const pathFormed =
      environment.jaqpotApi + this._modelBase + modelId + '/ontrash';
    return this.http.put(pathFormed, model, { headers: headers }).pipe(
      tap((res: Response) => {
        return res;
      }),
      catchError((err) => this.dialogsService.onError(err)),
    );
  }

  public getWithIdSecured<Model>(id: string): Observable<Model> {
    return super
      .getWithIdSecured<Model>(id)
      .pipe(tap((model) => this.setCurrentModel(model)));
  }

  private setCurrentModel(model: Model) {
    this.currentModelSubject.next({
      model,
      modelId: model._id,
      entityId: 'model/' + model._id,
    });
  }
}
