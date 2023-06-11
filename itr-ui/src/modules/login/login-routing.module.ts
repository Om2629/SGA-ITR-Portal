import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './containers/login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '@modules/app-common/guard/auth.guard';

const routes: Routes = [
  {path: "", component: LoginComponent},
  { path: "register", component: RegisterComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
