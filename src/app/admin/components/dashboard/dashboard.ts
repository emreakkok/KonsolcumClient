import { Component } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignalRService } from '../../../services/common/signalr-service';
import { ReceiveFunctions } from '../../../constants/receive-functions';
import { HubUrls } from '../../../constants/hub-urls';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../services/common/custom-toastr';
import { AuthService } from '../../../services/common/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard extends Base {
  constructor(spinner: NgxSpinnerService,private signalRService : SignalRService , private customToastr : CustomToastr,private authService: AuthService ) {
      super(spinner);
    }
  
    ngOnInit() {
  if (!this.authService.hasOnlyRole('Genel User Yetkisi')) {
      try {
        this.signalRService.start(HubUrls.CategoryHub);
        this.signalRService.start(HubUrls.ProductHub);
        this.signalRService.start(HubUrls.OrderHub);
        
        // Listener'ları ayarla
        this.signalRService.on(HubUrls.CategoryHub, ReceiveFunctions.CategoryAddedMessageReceiveFunction, (message: string) => {
          this.customToastr.message(message, "Kategori Bilgilendirme!", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopRight
          });
        });

        this.signalRService.on(HubUrls.ProductHub, ReceiveFunctions.ProductAddedMessageReceiveFunction, (message: string) => {
          this.customToastr.message(message, "Ürün Bilgilendirme!", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopRight
          });
        });

        this.signalRService.on(HubUrls.OrderHub, ReceiveFunctions.OrderAddedMessageReceiveFunction, (message: string) => {
          this.customToastr.message(message, "Sipariş Bilgilendirme!", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopCenter
          });
        });
        
      } catch (error) {
        console.error('SignalR setup failed:', error);
      }
    }
  }
}
