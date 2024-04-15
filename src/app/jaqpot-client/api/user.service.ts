import { Injectable } from '@angular/core';
import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { EucliaAccountsFactory } from '@euclia/accounts-client';
import { IEucliaAccounts } from '@euclia/accounts-client';
import { User as EucliaUser } from '@euclia/accounts-client';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  private _privateBasePath: string;

  // private user:User;
  private _userBase: string;
  private accountsClient: IEucliaAccounts;

  constructor(
    public http: HttpClient,
    public sessionService: SessionService,
    public dialogsService: DialogsService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    // super(http, dialogsService, oidcSecurityService, "/user/")
    // console.log("User api at:")
    // console.log(Config.AccountsApi)
    (this.accountsClient = new EucliaAccountsFactory(
      environment.accountsApi,
    ).getClient()),
      (this._privateBasePath = environment.jaqpotApi);
    this._userBase = this._privateBasePath + '/user/';
  }

  public getUserById(id: string): Promise<EucliaUser> {
    const token = this.oidcSecurityService.getAccessToken();
    return this.accountsClient.getUser(id, token);
  }

  // public getUserById(id:string): Observable<User> {
  //     const token = this.oidcSecurityService.getAccessToken();
  //     const tokenValue = 'Bearer ' + token;
  //     let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  //     let params = new HttpParams();
  //     return this.http.get(this._userBase + id, { headers: headers, params: params }).pipe(
  //         tap((res : Response) => {
  //             return res
  //         }),catchError( err => this.dialogsService.onError(err) ));
  // }

  // public updateUserById(id:string, user:User): Observable<User> {
  //     const token = this.oidcSecurityService.getAccessToken();
  //     const tokenValue = 'Bearer ' + token;
  //     let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  //     let params = new HttpParams();
  //     return this.http.put(this._userBase + id, user ,{ headers: headers, params: params }).pipe(
  //         tap((res : Response) => {
  //             return res
  //         }),catchError( err => this.dialogsService.onError(err) ));
  // }

  // public searchUserByName(name:string): Observable<Array<User>> {
  //     const token = this.oidcSecurityService.getAccessToken();
  //     const tokenValue = 'Bearer ' + token;
  //     let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  //     let params = new HttpParams().set('name', name);
  //     return this.http.get(this._userBase + "search/and/found", { headers: headers, params: params }).pipe(
  //         tap((res : Response) => {
  //             return res
  //         }),catchError( err => this.dialogsService.onError(err) ));
  // }

  // public searchUserEmail(email:string): Observable<Array<User>> {
  //     const token = this.oidcSecurityService.getAccessToken();
  //     const tokenValue = 'Bearer ' + token;
  //     let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
  //     let params = new HttpParams().set('mail', email);
  //     return this.http.get(this._userBase + "search/and/found", { headers: headers, params: params }).pipe(
  //         tap((res : Response) => {
  //             return res
  //         }),catchError( err => this.dialogsService.onError(err) ));
  // }
}

//     protected basePath = 'http://dev.jaqpot.org:8081/jaqpot/services';
//     public defaultHeaders: Headers = new Headers();
//     public configuration: Configuration = new Configuration();

//     constructor(protected http: Http, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
//         if (basePath) {
//             this.basePath = basePath;
//         }
//         if (configuration) {
//             this.configuration = configuration;
// 			this.basePath = basePath || configuration.basePath || this.basePath;
//         }
//     }

//     /**
//      *
//      * Extends object by coping non-existing properties.
//      * @param objA object to be extended
//      * @param objB source object
//      */
//     private extendObj<T1,T2>(objA: T1, objB: T2) {
//         for(let key in objB){
//             if(objB.hasOwnProperty(key)){
//                 (objA as any)[key] = (objB as any)[key];
//             }
//         }
//         return <T1&T2>objA;
//     }

//     /**
//      * @param consumes string[] mime-types
//      * @return true: consumes contains 'multipart/form-data', false: otherwise
//      */
//     private canConsumeForm(consumes: string[]): boolean {
//         const form = 'multipart/form-data';
//         for (let consume of consumes) {
//             if (form === consume) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     /**
//      * Finds User by Id
//      * Finds specified user
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access this resource
//      */
//     public getUser(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.getUserWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Retrieves user&#39;s quota
//      * Returns user&#39;s quota given the user&#39;s ID. Authenicated users can access only their own quota.
//      * Jaqpot administrators can access the quota of all Jaqpot users.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access this resource
//      */
//     public getUserQuota(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.getUserQuotaWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Lists all Users (admins only)
//      * Lists all Users of Jaqpot Quattro. This operation can only be performed by the system administrators.
//      * @param subjectid Clients need to authenticate in order to access models
//      * @param start start
//      * @param max max
//      */
//     public listUsers(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listUsersWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds User by Id
//      * Finds specified user
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access this resource
//      */
//     public getUserWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/user/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getUser.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Retrieves user&#39;s quota
//      * Returns user&#39;s quota given the user&#39;s ID. Authenicated users can access only their own quota.
//      * Jaqpot administrators can access the quota of all Jaqpot users.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access this resource
//      */
//     public getUserQuotaWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/user/${id}/quota'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getUserQuota.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json'
//         ];

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Lists all Users (admins only)
//      * Lists all Users of Jaqpot Quattro. This operation can only be performed by the system administrators.
//      * @param subjectid Clients need to authenticate in order to access models
//      * @param start start
//      * @param max max
//      */
//     public listUsersWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/user';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (start !== undefined) {
//             queryParameters.set('start', <any>start);
//         }

//         if (max !== undefined) {
//             queryParameters.set('max', <any>max);
//         }

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

// }
