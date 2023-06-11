import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { UsersService } from '@modules/file-itr/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public contents: any = ["Content 1", "Content 2", "Content 3", "Content 4", "Content 5", "Content 6", "Content 7"];
  userList: any;
  constructor(private usersService: UsersService, private toastr: ToastrService, private router: Router,
    private tokenManagerService: TokenManagerService) { }

  ngOnInit() {
    this.fetchUserList();
  }

  fetchUserList() {
    this.usersService.fetchUsers().subscribe({
      next: (response) => {
        let resBody: any = response.body;
        console.log(resBody);

        if (!resBody["error"]) {
          this.userList = resBody;
        } else {
          this.toastr.error("Something went wrong", "Error", { closeButton: true });
        }
      },
      error: (err) => {
        this.toastr.error("Something went wrong", "Error", { closeButton: true });
        console.log(err);
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

  redirectToFileUpload(panNumber: string) {
    this.usersService.panNo = panNumber;
    this.router.navigate(['/file-itr/upload-file']);
  }

  displayStatus(status: string){
    if(status == "New") return 'btn btn-danger';
    else if(status == "In Progress") return 'btn btn-sm btn-warning';
    else return 'btn btn-success';
  }
}
