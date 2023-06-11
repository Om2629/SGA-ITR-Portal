import { Component, OnInit } from '@angular/core';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { UsersService } from '@modules/file-itr/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-itr-table',
  templateUrl: './itr-table.component.html',
  styleUrls: ['./itr-table.component.scss']
})
export class ItrTableComponent implements OnInit{
  public contents : any = ["Content 1","Content 2","Content 3","Content 4","Content 5","Content 6","Content 7"];
  public isShowData : boolean = false;
  public panNumber: string = "";
  public itrFiles: any;

  constructor(private usersService: UsersService, private tokenManagerService: TokenManagerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.panNumber = this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.PAN_NO);
    this.fetchItrHistory();
  }

  fetchItrHistory(){
    this.usersService.fetchITRHistory(this.panNumber).subscribe({
      next: (res)=>{
        let resBody: any = res.body;
        console.log(resBody);
        
        if (!resBody["error"]) {
          this.itrFiles = resBody.files;
        } else {
          this.toastr.error("Failed to fetch ITR History", "Error", { closeButton: true });
        }
      },
      error: (err)=> {
        console.log(err);
        this.toastr.error("Something went wrong", "Error", { closeButton: true });
      }
    })
  }

  downloadFile(panNo: string, year: string, fileName: string) {
    let requestedBy = this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.USER_ROLE);
    this.usersService.downloadFile(panNo, year, requestedBy, fileName).subscribe({
      next: (res: any) => {
        let response: any = res.body;
        if (!response["error"]) {
          const fileName = this.getFileNameFromResponse(res);
          this.saveFile(response, fileName);
        } else {
          this.toastr.error("Failed to download file", "Error", { closeButton: true });
        }
      },
      error: (err) => {
        this.toastr.error("Failed to download file", "Error", { closeButton: true });
        console.log(err.URL);
      }
    }
    );
  }

  private getFileNameFromResponse(response: any): string {
    const contentDisposition = response.headers.get('content-disposition');
    const match = contentDisposition.match(/filename="?(.+)""?/);
    return match ? match[1] : 'file';
  }

  private saveFile(data: Blob, fileName: string) {
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
  showData(){
  if(this.isShowData){
    this.isShowData = false;
    setTimeout(()=>{
      this.isShowData = true;
    },50);
  }else this.isShowData = true;
  }

  makeTrue(){
    this.isShowData = true;
  }

  displayStatus(status: string){
    if(status == "New") return 'btn btn-danger';
    else if(status == "In Progress") return 'btn btn-sm btn-warning';
    else return 'btn btn-success';
  }
}
