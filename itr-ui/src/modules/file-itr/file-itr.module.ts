import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { FileItrRoutingModule } from './file-itr-routing.module';
import { FileItrComponent } from './file-itr/file-itr.component';
import { ItrTableComponent } from './containers/itr-table/itr-table.component';
import { FileUploadComponent } from './containers/file-upload/file-upload.component';
import { FileUploadService } from './services/file-upload.service';
import { UserListComponent } from './containers/user-list/user-list.component';
import { UsersService } from './services/users.service';
import { AppCommonModule } from '@modules/app-common/app-common.module';


@NgModule({
  declarations: [FileItrComponent, ItrTableComponent, FileUploadComponent, UserListComponent],
  imports: [
    CommonModule,
    FileItrRoutingModule,
    AppCommonModule,
    ReactiveFormsModule, FormsModule
  ],
  providers: [
    FileUploadService,
    UsersService
  ]
})
export class FileItrModule { }
