import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", loadChildren: () => import("@modules/login/login.module").then(m => m.LoginModule) },
  { path: "login", loadChildren: () => import("@modules/login/login.module").then(m => m.LoginModule) },
  { path: "nav", loadChildren: () => import("@modules/navigation/navigation.module").then(m => m.NavigationModule) },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
