import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Algorithm } from '../jaqpot-client/model/algorithm';
import { Dataset } from '../jaqpot-client/model/dataset';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

@Injectable()
export class SessionService {
  private subjectId = new Subject<any>();
  token: string;
  userid: string;
  userEmail: string;
  private accessToken: Subject<string>;
  private userName = new Subject<any>();
  //private loggedIn = new Subject<any>();
  private theme = new Subject<any>();
  // algo:Algorithm
  // algorithm$: Subject<Algorithm> = new BehaviorSubject(this.algo);
  // modelingAlgorithm:Algorithm
  // modelingAlgorithm$: Subject<Algorithm> = new BehaviorSubject(this.modelingAlgorithm);
  // private dataset: Dataset;

  userData$: Observable<any>;

  _userData: any;

  constructor(private _oidc: OidcSecurityService) {
    // this.token = this._oidc.getAccessToken()
    // this.accessToken.next(this._oidc.getAccessToken())
    // this.token = this._oidc.getAccessToken()
    // this.userData$ = this._oidc.userData$
    // this.userData$.subscribe(d=>{
    //     this._userData = d
    //     this.userid = d.sub
    //     this.userEmail = d.email
    // })
  }

  getSubjectId(): Observable<any> {
    return this.subjectId.asObservable();
  }

  getUserId() {
    return this.userid;
  }

  getUserData() {
    return this._userData;
  }

  setUserData(userDataResult: UserDataResult) {
    const userData = userDataResult.userData;
    const { email, sub } = userData;
    this._userData = userData;
    this.userEmail = email;
    this.userid = sub;
  }

  getUserName(): Observable<any> {
    return this.userName.asObservable();
  }

  getTheme(): Observable<any> {
    return this.theme.asObservable();
  }

  getTokenObservable(): Observable<string> {
    return this.accessToken.asObservable();
  }

  getToken(): string {
    return this._oidc.getAccessToken();
    // return this.token
  }

  // getAlgorithm(): Observable<Algorithm>{
  //     return this.algorithm$.asObservable();
  // }

  // clearAlgorithm(){
  //     this.algorithm$.next();
  // }

  // setAlgorithm(algorithm:Algorithm){
  //     this.algorithm$.next( algorithm )
  // }

  // getDataset(){
  //     return this.dataset;
  // }

  // clearDataset(){
  //     this.dataset = null;
  // }

  // setDataset(dataset:Dataset){
  //     this.dataset = dataset
  // }

  // clearModelingAlgorithm(){
  //     this.modelingAlgorithm$.next();
  // }

  // setModelingAlgorithm(algorithm:Algorithm){
  //     this.modelingAlgorithm$.next( algorithm )
  // }

  // getModelingAlgorithm(){
  //     return this.modelingAlgorithm$.asObservable();
  // }

  // clearModelingDataset(){
  //     this.modelingDataset.next();
  // }

  // setModelingDataset(dataset:Dataset){
  //     this.modelingDataset.next( dataset )
  // }

  // getModelingDataset(){
  //     return this.modelingDataset.asObservable();
  // }

  setAccessToken(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  // getAccessToken(){
  //     return this.accessToken.asObservable();
  // }

  get(key: any) {
    return localStorage.getItem(key);
  }

  remove(key: any) {
    switch (key) {
      case 'subjectId': {
        this.subjectId.next();
        break;
      }
      //case 'loggedIn':{
      //     var fal = "false";
      //     this.loggedIn.next({ fal });
      //      break;
      //   }
      case 'userName': {
        this.userName.next();
        break;
      }
    }
    return localStorage.removeItem(key);
  }

  clear() {
    var nul = 'null';
    this.subjectId.next({ nul });
    //   this.loggedIn.next({ nul });
    this.userName.next({ nul });
    return localStorage.clear();
  }

  clearUsername() {
    this.userName.next();
    return localStorage.clear();
  }

  clearSubject() {
    var nul = 'null';
    this.subjectId.next({ nul });
  }

  set(key: any, data: any) {
    switch (key) {
      case 'subjectId': {
        this.subjectId.next({ data });
        break;
      }
      case 'userName': {
        this.userName.next({ data });
        break;
      }
      case 'theme': {
        this.theme.next({ data });
        break;
      }
    }
    return localStorage.setItem(key, data);
  }
}
