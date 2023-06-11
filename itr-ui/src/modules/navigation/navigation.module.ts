import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule, NgbModalModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './containers/home/home.component';
import { ChangePasswordComponent } from './containers/change-password/change-password.component';
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ProfileComponent } from './containers/profile/profile.component';


@NgModule({
  declarations: [NavigationComponent,
  HomeComponent, ChangePasswordComponent, DashboardComponent, ProfileComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    AppCommonModule,
    ReactiveFormsModule,
    FormsModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatButtonModule,
    // MatIconModule,
    // MatDividerModule,
    NgbModule, NgbModalModule, NgbDropdownModule
  ]
})
export class NavigationModule { }
