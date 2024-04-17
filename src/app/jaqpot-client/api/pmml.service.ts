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

// import { Pmml } from '../model/pmml';

// import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
// import { Configuration }                                     from '../configuration';

// @Injectable()
// export class PmmlService {

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
//      * Creates a new PMML entry
//      * Creates a new PMML entry which is assigned a random unique ID
//      * @param subjectid Clients need to authenticate in order to create resources on the server
//      * @param title title
//      * @param description description
//      */
//     public createPMML(subjectid?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.createPMMLWithHttpInfo(subjectid, title, description, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates a new PMML entry
//      * Creates a new PMML entry which is assigned a random unique ID
//      * @param subjectid Authorization token
//      * @param features
//      */
//     public createPMMLSelection(subjectid?: string, features?: string, extraHttpRequestParams?: any): Observable<Pmml> {
//         return this.createPMMLSelectionWithHttpInfo(subjectid, features, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Returns PMML entry
//      * Finds and returns a PMML document by ID
//      * @param id ID of the BibTeX
//      * @param subjectid Authorization token
//      */
//     public getPmml(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.getPmmlWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds all PMML entries
//      * Finds all PMML entries in the DB of Jaqpot and returns them in a list
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max
//      */
//     public listPmml(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listPmmlWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates a new PMML entry
//      * Creates a new PMML entry which is assigned a random unique ID
//      * @param subjectid Clients need to authenticate in order to create resources on the server
//      * @param title title
//      * @param description description
//      */
//     public createPMMLWithHttpInfo(subjectid?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/pmml';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Content-Type header
//         let consumes: string[] = [
//             'application/xml',
//             'text/xml',
//             'multipart/form-data'
//         ];
//         let canConsumeForm = this.canConsumeForm(consumes);
//         let useForm = false;
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];

//         if (title !== undefined) {
//             formParams.set('title', <any>title);
//         }

//         if (description !== undefined) {
//             formParams.set('description', <any>description);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formParams.toString(),
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
//      * Creates a new PMML entry
//      * Creates a new PMML entry which is assigned a random unique ID
//      * @param subjectid Authorization token
//      * @param features
//      */
//     public createPMMLSelectionWithHttpInfo(subjectid?: string, features?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/pmml/selection';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Content-Type header
//         let consumes: string[] = [
//             'application/x-www-form-urlencoded'
//         ];
//         let canConsumeForm = this.canConsumeForm(consumes);
//         let useForm = false;
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];

//         if (features !== undefined) {
//             formParams.set('features', <any>features);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formParams.toString(),
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
//      * Returns PMML entry
//      * Finds and returns a PMML document by ID
//      * @param id ID of the BibTeX
//      * @param subjectid Authorization token
//      */
//     public getPmmlWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/pmml/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getPmml.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list',
//             'application/xml',
//             'text/xml'
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
//      * Finds all PMML entries
//      * Finds all PMML entries in the DB of Jaqpot and returns them in a list
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max
//      */
//     public listPmmlWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/pmml';

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
