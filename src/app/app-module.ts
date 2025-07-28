import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AdminModule } from './admin/admin-module';
import { UiModule } from './ui/ui-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt" 
import { HttpErrorHandlerInterceptorService } from './services/common/http-error-handler-interceptor-service';
import { DynamicLoadComponent } from './directives/common/dynamic-load-component';
import { registerLocaleData } from '@angular/common'; 
import localeTr from '@angular/common/locales/tr';

registerLocaleData(localeTr);
@NgModule({
  declarations: [
    App,
    DynamicLoadComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule,UiModule,NgxSpinnerModule,HttpClientModule,
    JwtModule.forRoot({
    config: {
    tokenGetter: tokenGetter,
    allowedDomains: ["localhost:7240"], // API domain'inizi buraya yazın
  }
}),
    ToastrModule.forRoot({    // Toastr modülünü global olarak ekle
    })
    
  ],
  providers: [
    {provide:"baseUrl",useValue :"https://localhost:7240/api", multi: true},
    {provide:"baseSignalRUrl",useValue :"https://localhost:7240/", multi: true},
    
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    {provide:HTTP_INTERCEPTORS, useClass:HttpErrorHandlerInterceptorService, multi: true}
  ],
  bootstrap: [App]
})
export class AppModule { }

export function tokenGetter() {
  // Browser kontrolü ekleyin
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem("accessToken");
  }
  return null;
}
