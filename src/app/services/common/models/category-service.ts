import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client-service';
import { Create_Category } from '../../../contracts/category/create_category';
import { error } from 'node:console';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Category } from '../../../contracts/category/list_category';
import { firstValueFrom, Observable } from 'rxjs';
import { FileContract } from '../../../contracts/file-contract';
import { List_Product } from '../../../contracts/list_product';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClientService: HttpClientService) { }
  
 createCategory(
  category: Create_Category,
  successCallBack?: () => void,
  errorCallBack?: (errorMessage: string) => void
): void {
  this.httpClientService.post(
    { controller: "categories" }, category
  ).subscribe({
    next: () => {
      if (successCallBack) successCallBack();
    },
    error: (errorResponse: HttpErrorResponse) => {
      let message = "Kategori oluşturulurken bir hata oluştu!";

      const errorData = errorResponse.error;

      if (Array.isArray(errorData)) {
        // FluentValidation gibi key-value array response'u
        let messages: string[] = [];
        for (const item of errorData) {
          if (item?.value && Array.isArray(item.value)) {
            messages.push(...item.value); // ["hata1", "hata2"]
          }
        }
        if (messages.length > 0)
          message = messages.join("<br>");
      } else if (typeof errorData === "string") {
        message = errorData;
      } else if (errorData?.errors) {
        const validationErrors = [];
        for (const field in errorData.errors) {
          if (Array.isArray(errorData.errors[field])) {
            validationErrors.push(...errorData.errors[field]);
          } else {
            validationErrors.push(errorData.errors[field]);
          }
        }
        if (validationErrors.length > 0)
          message = validationErrors.join("<br>");
      } else if (errorData?.message) {
        message = errorData.message;
      } else if (errorResponse.message) {
        message = errorResponse.message;
      }

      if (errorCallBack) errorCallBack(message);
    }
  });
}




  async read(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{totalCategoryCount:number, categories:List_Category[]}> {
    
      const promiseData: Promise<{totalCategoryCount:number, categories:List_Category[]}> = firstValueFrom(
        this.httpClientService.get<{totalCategoryCount:number, categories:List_Category[]}>({
      controller: "categories",
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

  //kullanmadım ama select-category-image-dialogda aynı işlevli var
  async readCategoryImages(id: string): Promise<FileContract[]> {
    const getObservable: Observable<FileContract[]> = this.httpClientService.get<FileContract[]>(
      {
        controller: "categories",
        action: `${id}/images`
      }
    );

    return await firstValueFrom(getObservable);
  }


  // category-service.ts

// Tüm kategorileri getirir (admin için)
async getAllCategories(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalCategoryCount: number, categories: List_Category[] }> {
  const promiseData: Promise<{ totalCategoryCount: number, categories: List_Category[] }> = firstValueFrom(
    this.httpClientService.get<{ totalCategoryCount: number, categories: List_Category[] }>({
      controller: "categories",
      action: "GetAllCategories", // Backend'deki action
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

// Sadece aktif kategorileri getirir (UI için)
async getActiveCategories(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{ totalCategoryCount: number, categories: List_Category[] }> {
  const promiseData: Promise<{ totalCategoryCount: number, categories: List_Category[] }> = firstValueFrom(
    this.httpClientService.get<{ totalCategoryCount: number, categories: List_Category[] }>({
      controller: "categories",
      action: "GetActiveCategories", // Backend'deki action
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


async getProductsByCategory(
  categoryId: string, 
  page?: number, 
  size?: number, 
  successCallBack?: () => void, 
  errorCallback?: (errorMessage: string) => void
): Promise<{ 
  totalProductCount: number; 
  products: List_Product[];
  categoryName: string;
  success: boolean;
  message: string;
}> {
  
  // Parametre kontrolü
  if (!categoryId || categoryId.trim() === '') {
    const errorMsg = 'Kategori ID\'si boş olamaz.';
    if (errorCallback) errorCallback(errorMsg);
    throw new Error(errorMsg);
  }

  const promiseData: Promise<{
    totalProductCount: number;
    products: List_Product[];
    categoryName: string;
    success: boolean;
    message: string;
  }> = firstValueFrom(
    this.httpClientService.get<{
      totalProductCount: number;
      products: List_Product[];
      categoryName: string;
      success: boolean;
      message: string;
    }>({
      controller: "categories",
      action: "GetProductsByCategory",
      queryString: `categoryId=${categoryId}&page=${page || 0}&size=${size || 12}`
    })
  );

  promiseData
    .then((result) => {
      if (result.success && successCallBack) {
        successCallBack();
      } else if (!result.success && errorCallback) {
        errorCallback(result.message || 'Ürünler getirilirken bir hata oluştu.');
      }
    })
    .catch((errorResponse: HttpErrorResponse) => {
      let errorMessage = "Kategoriye ait ürünler getirilirken bir hata oluştu!";

      const errorData = errorResponse.error;
      
      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorResponse.message) {
        errorMessage = errorResponse.message;
      }

      if (errorCallback) errorCallback(errorMessage);
    });

  return await promiseData;
}

/**
 * Kategori adını ID'ye göre getirir (cache için kullanılabilir)
 * @param categoryId Kategori ID'si
 * @returns Kategori adı
 */
async getCategoryNameById(categoryId: string): Promise<string> {
  try {
    const result = await this.getProductsByCategory(categoryId, 0, 1);
    return result.categoryName || 'Bilinmeyen Kategori';
  } catch (error) {
    return 'Bilinmeyen Kategori';
  }
}

async getCategoryById(id: string): Promise<List_Category> {
  // ID'nin boş olup olmadığını kontrol edelim.
  if (!id) {
    throw new Error("Kategori ID'si boş olamaz.");
  }

  const getObservable: Observable<List_Category> = this.httpClientService.get<List_Category>({
    controller: "categories",
    action: `${id}` // ID'yi action olarak gönderiyoruz.
  });

  return await firstValueFrom(getObservable);
}


updateCategory(
  category: List_Category,
  successCallback?: () => void,
  errorCallback?: (errorMessage: string) => void
): void {
  this.httpClientService.put({ controller: "categories" , action: `${category.id}`}, category).subscribe({
      next: (response: any) => { // Backend'den gelen yanıtı yakalamak için response parametresi eklendi
        if (successCallback) successCallback();
      },
      error: (errorResponse: HttpErrorResponse) => {
        let message = "Kategori güncellenirken bir hata oluştu!"; // Varsayılan genel mesaj

        const errorData = errorResponse.error; // Backend'den gelen hata nesnesi veya string

        if (Array.isArray(errorData)) {
          // FluentValidation gibi key-value array response'u
          let messages: string[] = [];
          for (const item of errorData) {
            if (item?.value && Array.isArray(item.value)) {
              messages.push(...item.value); // ["hata1", "hata2"]
            }
          }
          if (messages.length > 0)
            message = messages.join("<br>");
        } else if (typeof errorData === "string") {
          message = errorData; // Düz string hata mesajı
        } else if (errorData?.errors) {
          // ASP.NET Core model validasyon hataları (errors nesnesi)
          const validationErrors = [];
          for (const field in errorData.errors) {
            if (Array.isArray(errorData.errors[field])) {
              validationErrors.push(...errorData.errors[field]);
            } else {
              validationErrors.push(errorData.errors[field]);
            }
          }
          if (validationErrors.length > 0)
            message = validationErrors.join("<br>");
        } else if (errorData?.message) {
          // Özel bir 'message' özelliği olan hata nesnesi
          message = errorData.message;
        } else if (errorResponse.message) {
          // HttpErrorResponse'un kendi mesajı
          message = errorResponse.message;
        }

        if (errorCallback) errorCallback(message);
      }
    });
}



}
