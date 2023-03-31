import {throwError as observableThrowError,  Observable, interval } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import '../rxjs-operators';
import { map, filter, catchError, mergeMap, tap, retryWhen } from 'rxjs/operators';
import { Dataset } from '../model/dataset';
import { Config } from '../../config/config';
import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MetaInfo, Model, Task } from '../model/models';



@Injectable()
export class HttkApiService extends BaseClient<Task>{

    _privateBasePath:string;
    private dataset:Dataset;
    _httkBase:string = "/biokinetics/httk/"

    constructor(http: HttpClient,
        public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/biokinetics/httk/createmodel/")
            this.oidcSecurityService.getAccessToken().subscribe(t=>{
                this._token = t
            })
    }

    public createHttkModel(parameters:string, title:string, description:string):Observable<Task>{
        // const token = this.oidcSecurityService.getToken();
        const token = this._token
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization', tokenValue);
        let params = new HttpParams().set('parameters', parameters).set('title', title).set('description', description);
        let pathFormed = Config.JaqpotBase + this._httkBase + 'createmodel'
        return this.http.post(pathFormed, params.toString(),{headers:headers}).pipe(
            tap((res : Response) => { 
                return res      
            }),catchError( err => this.dialogsService.onError(err) )
        )
    }

    public predictFromModel(modelId:string):Observable<Task>{
        // const token = this.oidcSecurityService.getToken();
        const token = this._token
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization', tokenValue);
        let params = new HttpParams().set('visible', "true");
        let pathFormed = Config.JaqpotBase + this._httkBase + 'model/' + modelId
        return this.http.post(pathFormed,params.toString(),{headers:headers}).pipe(
            tap((res : Response) => { 
                return res      
            }),catchError( err => this.dialogsService.onError(err) )
        )
    }



}