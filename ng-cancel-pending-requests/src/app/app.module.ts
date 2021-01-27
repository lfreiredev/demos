import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './interceptors/custom-http.interceptor';
import { RequestsService } from './services/requests.service';
import { Test2Component } from './components/test2.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent, TestComponent, Test2Component],
  imports: [BrowserModule, CommonModule, AppRoutingModule, HttpClientModule],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CustomHttpInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
