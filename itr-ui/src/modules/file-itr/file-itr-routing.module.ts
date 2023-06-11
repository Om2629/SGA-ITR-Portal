import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileItrComponent } from './file-itr/file-itr.component';
import { ItrTableComponent } from './containers/itr-table/itr-table.component';
import { FileUploadComponent } from './containers/file-upload/file-upload.component';
import { UserListComponent } from './containers/user-list/user-list.component';
import { AuthGuard } from '@modules/app-common/guard/auth.guard';

const routes: Routes = [
  {path: "",
  component: FileItrComponent,
  children:[
    // { path: "", component: ItrTableComponent },
    { path: "table", component: ItrTableComponent, canActivate: [AuthGuard] },
    { path: "upload-file", component: FileUploadComponent,canActivate: [AuthGuard]},
    { path: "user-list", component: UserListComponent,canActivate: [AuthGuard]}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileItrRoutingModule { }
