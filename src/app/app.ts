import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/common/auth-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from './services/common/custom-toastr';
import { Router } from '@angular/router';
import { HttpClientService } from './services/common/http-client-service';
import { ComponentType, DynamicLoadComponentService } from './services/common/dynamic-load-component-service';
import { DynamicLoadComponent } from './directives/common/dynamic-load-component';
import { Basket } from './ui/components/basket/basket';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  // protected title = 'KonsolcumClient';
  @ViewChild(DynamicLoadComponent, {static: true})
  dynamicLoadComponent: DynamicLoadComponent

  constructor(public authService : AuthService , private customToastr : CustomToastr,private router:Router, private httpClientService : HttpClientService, private dynamicLoadComponentService: DynamicLoadComponentService) {
     
    
    
    authService.identityCheck();
  }

 ngOnInit() {
    
  }

  signOut(){
  // AuthService'deki logout metodunu kullan
  this.authService.logout();
  
  // Ana sayfaya yönlendir
  this.router.navigate([""]);
  
  // this.authService.identityCheck();
  
  // Başarı mesajı göster
  this.customToastr.message("Oturum Kapatılmıştır!","Oturum Kapatıldı",  {
    messageType : ToastrMessageType.Warning,
    position : ToastrPosition.TopRight
  })
}


  async loadComponent(){
    console.log("Sepet component yükleniyor...");
    await this.dynamicLoadComponentService.loadComponent(ComponentType.Basket,this.dynamicLoadComponent.viewContainerRef);
    
  }

}
