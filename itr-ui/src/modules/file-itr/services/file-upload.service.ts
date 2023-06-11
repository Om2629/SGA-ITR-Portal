import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private fileUploadEndPoint: string;

  constructor(private httpClient: HttpClient) { 
    this.fileUploadEndPoint = environment.API_ENDPOINT + "upload";
  }

  uploadFiles(file:File, fileName: string, uploadedBy: string, uploadedFor: string){
    console.log(file);
    let data: FormData = new FormData();
    data.append("fileName", fileName);
    data.append("uploadedBy",uploadedBy);
    data.append("uploadedFor", uploadedFor);
    data.append("file",file);
    return this.httpClient.post(this.fileUploadEndPoint, data, { observe: 'response' });
  }
}
