import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
// import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '@modules/login/services/login.service';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersService } from '@modules/file-itr/services/users.service';
import { ToastrService } from 'ngx-toastr';
// import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  public toggle: boolean = false;
  public isMenuCollapse: boolean = true;
  public isPageOpen : boolean = true;
  public isHomeOpen : boolean = true;
  public userRole : string = "";
  public panNumber : string = "";
  public userName : string = "";
  public isItrInitiatedFlag : boolean = false;
  sessionAttributes = environment.SESSION_ATTRIBUTES;
  
  constructor(private loginService: LoginService, private tokenManagerService: TokenManagerService,
    private router: Router, public spinner: NgxSpinnerService, private usersService: UsersService, private toastr: ToastrService){

  }

  ngOnInit() {
    this.userRole = this.tokenManagerService.getItemFromSessionStorage(this.sessionAttributes.USER_ROLE);
    this.panNumber = this.tokenManagerService.getItemFromSessionStorage(this.sessionAttributes.PAN_NO);
    this.userName = this.tokenManagerService.getItemFromSessionStorage(this.sessionAttributes.USERNAME);
    this.isItrFileInitiated();
  }

 toggleSidebar(){
  this.toggle = !this.toggle;
 }


 async logOut(){
  if (!await this.tokenManagerService.getItemFromSessionStorage(
    this.sessionAttributes.IS_LOGGEDIN
  )) {
    this.router.navigateByUrl("/login");
  } else {
    const refreshToken = await this.tokenManagerService.getItemFromSessionStorage(
      this.sessionAttributes.MY_REFRESH_TOKEN
    );
    this.spinner.show();
      this.loginService.logout(refreshToken).subscribe({
        next: (response) => {
          setTimeout(() =>{
            this.spinner.hide();
            this.tokenManagerService.removeUserTokenDataFromSessionStorage();
            this.router.navigateByUrl("/login");
          },2000)
        },
        error: (err) => {
          throwError(()=>(err));
        }
      }
      );
  }
 }

 isItrFileInitiated(){
  this.usersService.isItrInitiated(this.panNumber).subscribe({
    next: (res)=>{
      let resBody: any = res.body;
      console.log(resBody);
      
      if (!resBody["error"]) {
        console.log("in if");
        
       this.isItrInitiatedFlag = resBody.itrStatusFlag;
      } else {
        this.toastr.error("Failed to fetch ITR status", "Error", { closeButton: true });
      }
    },
    error: (err)=> {
      console.log(err);
      this.toastr.error("Something went wrong", "Error", { closeButton: true });
    }
  })
 }

 redirectToHome(){
  if(this.userRole == "admin"){
    this.router.navigate(["/file-itr/user-list"]);
  }else{
    this.router.navigate(["/file-itr/table"]);
  }
 }

 redirectToDashborad(){
  if(this.userRole == "admin"){
    this.router.navigate(["/dashboard"]);
  }else{
    this.router.navigate(["/file-itr/table"]);
  }
 }

 redirectToProfile(){
  this.router.navigate(["/profile"]);
 }
 redirectToUploadFile(){
  this.router.navigate(["/file-itr/upload-file"]);
 }

 redirectToChangePassword(){
  this.router.navigate(["/change-password"]);
 }

 testFunction(){
  this.loginService.test().subscribe({
    next: ()=> {
      console.log("Working");
      
    }
  })
 }
}
