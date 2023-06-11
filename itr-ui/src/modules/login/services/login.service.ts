import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginEndPoint: string;
  private testEndPoint: string;
  private logoutEndPoint: string;
  private changePasswordEndPoint: string;
  private userRegister: string;

  constructor(public httpClient: HttpClient) {
    this.loginEndPoint = environment.API_ENDPOINT + "auth/login";
    this.logoutEndPoint = environment.API_ENDPOINT + "auth/logout";
    this.testEndPoint = environment.API_ENDPOINT + "test";
    this.userRegister = environment.API_ENDPOINT + "users";
    this.changePasswordEndPoint = environment.API_ENDPOINT + "changePassword"
  }

  public login(username: any, password: any): Observable<any> {
    const body = { user: username, password: password };
    return this.httpClient.post(this.loginEndPoint, body);
  }

  public test(): Observable<any> {
    return this.httpClient.get(this.testEndPoint);
  }

  public logout(refreshToken: any): Observable<any> {
    return this.httpClient.post(this.logoutEndPoint, { refreshToken: refreshToken });
  }

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    let data = {
      userInfo: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword
      }
    }
    return this.httpClient.post(this.changePasswordEndPoint, data, { observe: 'response' });
  }

  public registerUser(userRegisterDetails: any): Observable<any> {
    let data = {
      userInfo: {
        userName: userRegisterDetails.userName,
        mobileNumber: userRegisterDetails.mobileNumber,
        email: userRegisterDetails.email,
        pancard: userRegisterDetails.pancard,
        role: userRegisterDetails.role,
        password: userRegisterDetails.password
      }
    }
    return this.httpClient.post(this.userRegister, data);
  }
}
