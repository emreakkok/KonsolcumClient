import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client-service';
import { Create_Order } from '../../../contracts/order/create-order';
import { firstValueFrom, Observable } from 'rxjs';
import { List_Order } from '../../../contracts/order/list-order';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderDetailDto } from '../../../contracts/order/order-detail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  
  constructor(private httpClientService : HttpClientService) { }


  async create(order: Create_Order): Promise<void>{
    const observable : Observable<any> = this.httpClientService.post({
      controller:"orders", 
    },order);
    await firstValueFrom(observable);
  }
  
  async getAllOrders(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{totalOrderCount:number, orders:List_Order[]}> {
    
      const promiseData: Promise<{totalOrderCount:number, orders:List_Order[]}> = firstValueFrom(this.httpClientService.get<{totalOrderCount:number, orders:List_Order[]}>({
      controller: "orders",
      queryString:`page=${page}&size=${size}`
    }));
    
    promiseData
    .then(() => {
      if (successCallBack) successCallBack();
    })
    .catch((errorResponse: HttpErrorResponse) => {
      if (errorCallback) errorCallback(errorResponse.message);
    });

    return await promiseData;
}

async getOrderDetail(orderId: string, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<OrderDetailDto> {
    try {
      // API'nin döneceği beklenen yapıyı belirtiyoruz: { order: OrderDetailDto }
      const promiseData: Promise<{ order: OrderDetailDto }> = firstValueFrom(
        this.httpClientService.get<{ order: OrderDetailDto }>({
          controller: "orders",
          action: `order-details/${orderId}` // Rota doğru
        })
      );

      const result = await promiseData;
      
      if (successCallBack) {
        successCallBack();
      }
      
      return result.order; // Yanıtın içindeki 'order' nesnesini döndürüyoruz
      
    } catch (error: any) {
      console.error('Order detail service hatası:', error);
      
      let errorMessage = 'Sipariş detayı alınamadı.'; // Varsayılan hata mesajı
      
      if (error instanceof HttpErrorResponse) {
        // Sunucudan gelen özel hata mesajlarını kontrol et
        if (error.error && typeof error.error === 'object') {
          // API'nizin döndüğü 'message' veya 'error' alanlarını kontrol edin
          errorMessage = error.error.message || error.error.error || errorMessage;
          // Eğer innerError da dönüyorsa onu da ekleyebiliriz
          if (error.error.innerError) {
            errorMessage += ` Detay: ${error.error.innerError}`;
          }
        } else if (typeof error.error === 'string') {
          errorMessage = error.error; // Eğer hata direkt string olarak geliyorsa
        } else {
          errorMessage = error.message; // Generic HttpErrorResponse mesajı
        }
      } else {
        errorMessage = error.message || errorMessage; // Diğer hata türleri
      }

      if (errorCallback) {
        errorCallback(errorMessage);
      }
      
      throw new Error(errorMessage); // Hatanın yayılmasını sağlayın
    }
  }

  async completeOrder(id: string){
    const observable: Observable<any> = this.httpClientService.get({
      controller: "orders",
      action: "complete-order"
    },id)

    await firstValueFrom(observable);
  }

}
