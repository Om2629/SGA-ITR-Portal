import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private totalClientandItrFileCount: string;
  private fetchClientProfile: any;

  constructor(private http: HttpClient) {
    this.totalClientandItrFileCount = environment.API_ENDPOINT + "users/totalClientandItrFileCount"
    this.fetchClientProfile = environment.API_ENDPOINT + "users/fetchClientProfile"
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.totalClientandItrFileCount);
  }

  getUsersData(username: any): Observable<any> {
    const body = { user: username };
    console.log("body", body)
    return this.http.post<any>(this.fetchClientProfile, body);
  }
}
