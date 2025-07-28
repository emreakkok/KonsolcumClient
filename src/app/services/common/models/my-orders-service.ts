import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client-service';
import { OrderDetailDto } from '../../../contracts/order/order-detail';
import { firstValueFrom } from 'rxjs';
import { MyOrdersResponse } from '../../../contracts/myorder/myorder';

@Injectable({
  providedIn: 'root'
})
export class MyOrdersService {

  constructor(private httpClientService: HttpClientService) { }

  async getMyOrders(
    page: number = 0,
    size: number = 5,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ): Promise<MyOrdersResponse> {
    try {
      const result = await firstValueFrom(
        this.httpClientService.get<MyOrdersResponse>({
          controller: "orders",
          action: "my-orders",
          queryString: `page=${page}&size=${size}`
        })
      );

      if (successCallback) successCallback();
      return result;

    } catch (error: any) {
      const message = this.extractErrorMessage(error);
      if (errorCallback) errorCallback(message);
      throw new Error(message);
    }
  }

  async getOrderDetail(
    orderId: string,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ): Promise<OrderDetailDto> {
    try {
      const result = await firstValueFrom(
        this.httpClientService.get<{ order: OrderDetailDto }>({
          controller: "orders",
          action: `order-details/${orderId}`
        })
      );

      if (successCallback) successCallback();
      return result.order;

    } catch (error: any) {
      const message = this.extractErrorMessage(error);
      if (errorCallback) errorCallback(message);
      throw new Error(message);
    }
  }

  private extractErrorMessage(error: any): string {
    let errorMessage = 'Beklenmeyen bir hata oluştu.';
    if (error.error && typeof error.error === 'object') {
      errorMessage = error.error.message || error.error.error || errorMessage;
      if (error.error.innerError) {
        errorMessage += ` Detay: ${error.error.innerError}`;
      }
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else {
      errorMessage = error.message || errorMessage;
    }
    return errorMessage;
  }
}