import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client-service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { FileContract } from '../../../contracts/file-contract';
import { firstValueFrom, Observable } from 'rxjs';
import { List_Product } from '../../../contracts/list_product';
import { ProductDetail } from '../../../contracts/product-detail';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  createProduct(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) { // <-- Callback tiplerini güncelledik
    this.httpClientService.post(
      { controller: "products" }, product
    ).subscribe({
      complete: () => { // complete callback'ini bir fonksiyon olarak tanımladık
        if (successCallBack) { // successCallBack'in varlığını kontrol et
          successCallBack();
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
        let message = "";

        if (_error && Array.isArray(_error)) { // _error'un varlığını ve dizi olup olmadığını kontrol et
            _error.forEach((v) => {
                if (v && v.value && Array.isArray(v.value)) {
                    v.value.forEach((_v) => {
                        message += `${_v}<br>`;
                    });
                }
            });
        } else if (typeof errorResponse.error === 'string') {
            // Eğer hata yanıtı düz bir string ise
            message = errorResponse.error;
        } else if (errorResponse.message) {
            // Eğer errorResponse.error boşsa ama errorResponse.message varsa
            message = errorResponse.message;
        } else {
            message = "Bilinmeyen bir hata oluştu.";
        }

        if (errorCallBack) { // errorCallBack'in varlığını kontrol et
          errorCallBack(message);
        }
      }
    });
  }

  async read(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{totalProductCount:number, products:List_Product[]}> {
    
    const promiseData: Promise<{totalProductCount:number, products:List_Product[]}> = firstValueFrom(this.httpClientService.get<{totalProductCount:number, products:List_Product[]}>({
      controller: "products",
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

  async readProductImages(id: string): Promise<FileContract[]> {
    const getObservable: Observable<FileContract[]> = this.httpClientService.get<FileContract[]>(
      {
        controller: "products",
        action: `${id}/images`
      }
    );

    return await firstValueFrom(getObservable);
  }

  async getActiveProducts(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalProductCount: number, products: List_Product[] }> {
    const promiseData: Promise<{ totalProductCount: number, products: List_Product[] }> = firstValueFrom(
      this.httpClientService.get<{ totalProductCount: number, products: List_Product[] }>({
        controller: "products",
        action: "GetActiveProducts", // Backend'deki action
        queryString: `page=${page}&size=${size}`
      })
    );
  
    promiseData
      .then(() => {
        if (successCallBack) successCallBack();
      })
      .catch((errorResponse: HttpErrorResponse) => {
        if (errorCallback) errorCallback(errorResponse.message);
      });
  
    return await promiseData;
  }

  async getProductDetail(productId: string, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<ProductDetail> {
  const promiseData: Promise<ProductDetail> = firstValueFrom(
    this.httpClientService.get<ProductDetail>({
      controller: "products",
      action: `${productId}/detail`
    })
  );

  promiseData
    .then(() => {
      if (successCallBack) successCallBack();
    })
    .catch((errorResponse: HttpErrorResponse) => {
      if (errorCallback) errorCallback(errorResponse.message);
    });

  return await promiseData;
}



async getProductById(id: string): Promise<List_Product> {
    if (!id) {
      throw new Error("Ürün ID'si boş olamaz.");
    }
    const getObservable: Observable<List_Product> = this.httpClientService.get<List_Product>({
      controller: "products",
      action: `${id}` // Backend'deki /{id} route'una karşılık gelir
    });
    return await firstValueFrom(getObservable);
  }

  updateProduct(
    product: List_Product,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ): void {
    this.httpClientService.put(
      {
        controller: "products",
        action: `${product.id}` // Ürün ID'sini URL'ye ekliyoruz
      },
      product // Güncellenmiş ürün nesnesini body olarak gönderiyoruz
    ).subscribe({
      next: (response: any) => {
        if (successCallback) successCallback();
      },
      error: (errorResponse: HttpErrorResponse) => {
        let message = "Ürün güncellenirken bir hata oluştu!"; // Varsayılan genel mesaj
        const errorData = errorResponse.error;

        if (Array.isArray(errorData)) { // FluentValidation'ın eski veya özel dizi formatı
          let messages: string[] = [];
          errorData.forEach((v: any) => { // 'any' kullanarak esnek olalım
            if (v?.value && Array.isArray(v.value)) {
              messages.push(...v.value);
            }
          });
          if (messages.length > 0) {
            message = messages.join("<br>");
          }
        } else if (errorData?.errors) { // ASP.NET Core'un standart model validasyon hataları (errors nesnesi)
          const validationErrors: string[] = [];
          for (const field in errorData.errors) {
            if (Array.isArray(errorData.errors[field])) {
              validationErrors.push(...errorData.errors[field]);
            } else {
              validationErrors.push(errorData.errors[field]);
            }
          }
          if (validationErrors.length > 0) {
            message = validationErrors.join("<br>");
          }
        } else if (typeof errorData === "string") {
          message = errorData; // Düz string hata mesajı
        } else if (errorData?.message) {
          message = errorData.message; // Özel bir 'message' özelliği olan hata nesnesi
        } else if (errorResponse.message) {
          message = errorResponse.message; // HttpErrorResponse'un kendi mesajı
        }

        if (errorCallback) {
          errorCallback(message);
        }
      }
    });
  }

}
