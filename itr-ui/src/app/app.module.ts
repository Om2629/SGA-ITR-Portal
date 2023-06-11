import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { AppComponent } from './app.component';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestInterceptor } from 'src/interceptor/requestinterceptor';
import { AppCommonModule } from '@modules/app-common/app-common.module';





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    NavigationModule,
    NgxSpinnerModule,
    HttpClientModule,
    ToastrModule.forRoot({
      maxOpened: 0,
      autoDismiss: true
    }),
  ],
  providers: [TokenManagerService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
