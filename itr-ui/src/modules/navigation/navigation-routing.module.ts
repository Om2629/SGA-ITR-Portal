import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './containers/home/home.component';
import { ChangePasswordComponent } from './containers/change-password/change-password.component';
import { AuthGuard } from '@modules/app-common/guard/auth.guard';

const routes: Routes = [{
  path: "",
  component: NavigationComponent,
  children: [
    { path: "file-itr", loadChildren: () => import("@modules/file-itr/file-itr.module").then(m => m.FileItrModule) },
    { path: "change-password", component: ChangePasswordComponent, canActivate: [AuthGuard]}
    // { path: "home", component: HomeComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
