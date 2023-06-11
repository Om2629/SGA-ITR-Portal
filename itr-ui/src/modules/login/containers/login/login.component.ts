import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { LoginService } from '@modules/login/services/login.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: any = FormGroup;
  loginId: any;
  password: any;
  userRole: string = "";
  userName: string = "";
  panNumber: string = "";

  constructor(private formBuilder: FormBuilder, public router: Router, public spinner: NgxSpinnerService,
    private loginService: LoginService, private tokenManagerService: TokenManagerService,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      loginId: ["", Validators.required],
      password: ["", Validators.required],
      // companyName: [""]
    });
  }


  onSubmit() {
    this.spinner.show();
    this.loginId = this.loginForm.get("loginId").value;
    this.password = this.loginForm.get("password").value;
    console.log(this.loginId, this.password);
    this.loginService.login(this.loginId, this.password).subscribe({
      next: (response) => {
        if (response.error) {
          this.loginForm.reset();
          this.spinner.hide();
          this.toastr.warning(environment.LOGIN_FAILED_MSG, environment.LOGIN_FAILED_TITLE, { closeButton: true });
        } else {
          this.userRole = response["role"];
          this.userName = response["user"];
          this.panNumber = response["pan"]
          this.tokenManagerService.setUserTokenDataToSessionStorage(
            response, "true", this.userName, this.userRole, this.loginId, this.panNumber
          );
          this.spinner.hide();
          setTimeout(() => {
            if(this.userRole == "admin"){
              this.router.navigate(["/file-itr/user-list"]);
            }else{
              this.router.navigate(["/file-itr/table"]);
            }
            this.spinner.hide("Loading");
          }, 2000);
        }
      },
      error: (e) => {
        this.loginForm.reset();
        this.spinner.hide();
        this.toastr.warning(environment.LOGIN_FAILED_MSG, environment.LOGIN_FAILED_TITLE, { closeButton: true });
        this.router.navigate(["/login"]);
      }
    }
    )
  }
}
