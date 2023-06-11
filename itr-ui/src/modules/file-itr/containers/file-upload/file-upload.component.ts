import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { FileUploadService } from '@modules/file-itr/services/file-upload.service';
import { UsersService } from '@modules/file-itr/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit{
  public fileName: string=""
  file: any;
  panNumber: string = "";

  constructor(private fileUploadService: FileUploadService,
    private router: Router, private toastr : ToastrService, private tokenManagerService: TokenManagerService,
    private usersService: UsersService) {}

    ngOnInit(){
      this.fileName = "";
      if(this.usersService.panNo != ""){
        this.panNumber = this.usersService.panNo
      }
    }

  onFileSelected(event:any): void {
    this.file = event.target.files[0];
    console.log(event.target.files);
    
    this.fileName = this.file.name;;
  }

  upload(){
    this.fileName = "";
    const uploadedBy = this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.USER_ROLE);
    let uploadedFor;
    uploadedBy == "admin" ? uploadedFor = this.panNumber : uploadedFor = this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.PAN_NO);
    this.fileUploadService.uploadFiles(this.file, this.file.name, uploadedBy, uploadedFor).subscribe({
      next: (res)=>{
        console.log(res);
        let resBody: any = res.body;
        if(!resBody["error"]){
          this.toastr.success("File Uploaded Successfully", "File upload", { closeButton: true });
        }else{
          this.toastr.error("Something went wrong", "Error", { closeButton: true });
        }
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/file-itr/upload-file']);
      }); 
      },
      error: (err) => {
        this.toastr.error("Something went wrong", "Error", { closeButton: true });
        console.log(err.URL);
      }
    })
  }
}
