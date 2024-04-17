import { Injectable } from '@angular/core';
import '../rxjs-operators';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpClient } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Report } from '../model/models';

@Injectable()
export class ReportApiService extends BaseClient<Report> {
  _privateBasePath: string;
  _reportBase: string = '/report/';

  constructor(
    http: HttpClient,
    public dialogsService: DialogsService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    super(http, dialogsService, oidcSecurityService, '/report/');
  }
}
// /**
//  * Jaqpot API
//  * Jaqpot v4 (Quattro) is the 4th version of a YAQP, a RESTful web service which can be used to train machine learning models and use them to obtain toxicological predictions for given chemical compounds or engineered nano materials. The project is written in Java8 and JEE7.
//  *
//  * OpenAPI spec version: 4.0.3
//  * Contact: hampos@me.com
//  *
//  * NOTE: This class is auto generated by the swagger code generator program.
//  * https://github.com/swagger-api/swagger-codegen.git
//  * Do not edit the class manually.
//  */

/* eslint-disable @typescript-eslint/member-ordering */

// import { Inject, Injectable, Optional }                      from '@angular/core';
// import { Http, Headers, URLSearchParams }                    from '@angular/http';
// import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
// import { Response, ResponseContentType }                     from '@angular/http';

// import { Observable }                                        from 'rxjs/Observable';
// import '../rxjs-operators';

// import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
// import { Configuration }                                     from '../configuration';

// @Injectable()
// export class ReportService {

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
//      * Creates PDF from report
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public createPDF(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.createPDFWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Retrieves Report by id
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public getReport(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.getReportWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Retrieves Reports of User
//      *
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public getReports(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
//         return this.getReportsWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Modifies a particular Report resource
//      * Modifies (applies a patch on) a Report resource of a given ID. This implementation of PATCH follows the RFC 6902 proposed standard. See https://tools.ietf.org/rfc/rfc6902.txt for details.
//      * @param id ID of an existing Report.
//      * @param body The patch in JSON according to the RFC 6902 specs
//      * @param subjectid Clients need to authenticate in order to create resources on the server
//      */
//     public modifyReport(id: string, body: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.modifyReportWithHttpInfo(id, body, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Removes Report by id
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public removeReport(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.removeReportWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates PDF from report
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public createPDFWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/report/${id}/pdf'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling createPDF.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json; charset=UTF-8'
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
//      * Retrieves Report by id
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public getReportWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/report/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getReport.');
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
//      * Retrieves Reports of User
//      *
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public getReportsWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/report';

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
//      * Modifies a particular Report resource
//      * Modifies (applies a patch on) a Report resource of a given ID. This implementation of PATCH follows the RFC 6902 proposed standard. See https://tools.ietf.org/rfc/rfc6902.txt for details.
//      * @param id ID of an existing Report.
//      * @param body The patch in JSON according to the RFC 6902 specs
//      * @param subjectid Clients need to authenticate in order to create resources on the server
//      */
//     public modifyReportWithHttpInfo(id: string, body: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/report/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling modifyReport.');
//         }
//         // verify required parameter 'body' is not null or undefined
//         if (body === null || body === undefined) {
//             throw new Error('Required parameter body was null or undefined when calling modifyReport.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];

//         headers.set('Content-Type', 'application/json');

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Patch,
//             headers: headers,
//             body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
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
//      * Removes Report by id
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public removeReportWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/report/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling removeReport.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json'
//         ];

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Delete,
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
