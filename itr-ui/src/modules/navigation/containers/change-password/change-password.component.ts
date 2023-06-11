import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { LoginService } from '@modules/login/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
  public changePasswordForm: any = FormGroup;
  currentPassword: any;
  newPassword: any;
  confirmPassword: any;

  constructor(private formBuilder: FormBuilder, public router: Router, public spinner: NgxSpinnerService,
    private loginService: LoginService, private tokenManagerService: TokenManagerService,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      // companyName: [""]
    });
  }

  onSubmit(){
    this.currentPassword = this.changePasswordForm.get("currentPassword").value;
    this.newPassword = this.changePasswordForm.get("newPassword").value;
    this.confirmPassword = this.changePasswordForm.get("confirmPassword").value;

    this.loginService.changePassword(this.currentPassword, this.newPassword, this.confirmPassword).subscribe({
      next:(res) => {
        console.log(res);
        let resBody: any = res.body;
        if(!resBody["error"]){
          this.changePasswordForm.reset();
          this.toastr.success("Password changed successfully", "Change Password", { closeButton: true });
        }else{
          this.changePasswordForm.reset();
          this.toastr.error("Something went wrong, please try again", "Error", { closeButton: true });
        }
      },
      error: (err) => {
        this.changePasswordForm.reset();
        this.toastr.error("Something went wrong, please try again", "Error", { closeButton: true });
      }
    })
  }
}
