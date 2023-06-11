import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './containers/login/login.component';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
import { LoginService } from './services/login.service';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatButtonModule,
    // MatIconModule,
    // MatDividerModule
  ],
  providers: [LoginService]
})
export class LoginModule { }
