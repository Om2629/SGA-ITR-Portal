import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private fetchUsersEndPoint: string;
  private downloadFileEndPoint: string;
  private itrInitiatedEndPoint: string;
  private itrHistroryEndPoint: string;
  public panNo: string = "";

  constructor(private httpClient: HttpClient) { 
    this.fetchUsersEndPoint = environment.API_ENDPOINT + "users";
    this.downloadFileEndPoint = environment.API_ENDPOINT + "download";
    this.itrInitiatedEndPoint = environment.API_ENDPOINT + "checkStatus";
    this.itrHistroryEndPoint = environment.API_ENDPOINT + "checkItrHistory";
  }

  fetchUsers(){
    return this.httpClient.get(this.fetchUsersEndPoint, { observe: 'response' });
  }

  downloadFile(panNumber: string, year: string, role: string, fileName: string){
    let data = {
      pan: panNumber,
      year: year,
      requestedBy: role,
      fileName: fileName
    }
    return this.httpClient.post(this.downloadFileEndPoint, data,{
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    });
  }

  isItrInitiated(panNo: string){
    let data = {
      pan: panNo
    }
    return this.httpClient.post(this.itrInitiatedEndPoint, data,{ observe: 'response' });
  }

  fetchITRHistory(panNo: string){
    let data = {
      pan: panNo
    }
    return this.httpClient.post(this.itrHistroryEndPoint, data,{ observe: 'response' });
  }
}
