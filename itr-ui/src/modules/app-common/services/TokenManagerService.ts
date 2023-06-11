import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable, Subject } from "rxjs";

@Injectable()
export class TokenManagerService {
  private storageSub = new Subject<String>();
  constructor() { }

  getItemFromSessionStorage(token: string): any {
    return sessionStorage.getItem(token);
  }

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItemToSessionStorage(token: string, value: string) {
    sessionStorage.setItem(token, value);
    this.storageSub.next("");
  }

  removeItemFromSessionStorage(token: string) {
    sessionStorage.removeItem(token);
    this.storageSub.next("");
  }

  //
  setUserTokenDataToSessionStorage(userToken: any, isLoggedin: string, userName: string, userRole: string, loginId: string, panNumber: string) {
    // Set JWT token data to sessionStorage
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.MY_TOKEN, userToken.token);
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.MY_REFRESH_TOKEN, userToken.refreshToken);
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.IS_LOGGEDIN, isLoggedin);
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.USERNAME, userName);
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.USER_ROLE, userRole);
    // this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.PERMISSIONS, JSON.stringify(permissions));
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.LOGIN_ID, loginId);
    this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.PAN_NO, panNumber);
  }

  removeUserTokenDataFromSessionStorage() {
    // keeping user selected language
    // const userlang = this.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.USER_LANGUAGE);
    // Remove JWT token data from sessionStorage
    sessionStorage.clear();
    // keeping user selected language
    // if (userlang) {
    //   this.setItemToSessionStorage(environment.SESSION_ATTRIBUTES.USER_LANGUAGE, userlang);
    // }

  }

}
