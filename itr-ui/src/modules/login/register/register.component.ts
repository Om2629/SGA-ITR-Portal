import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '@modules/login/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  constructor(private loginService: LoginService, private toastr: ToastrService) {
    this.registrationForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pancard: new FormControl('', [Validators.required, Validators.minLength(10)]),
      role: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }
  registerUser() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value)
      this.loginService.registerUser(this.registrationForm.value).subscribe((response: any) => {
        console.log(response)
        if (!response.error) {
          this.registrationForm.reset();
          this.toastr.success(response.message)
        }
        if (response.error) {
          this.registrationForm.reset();
          this.toastr.error(response.message)
        }
      });
    }
  }


}
