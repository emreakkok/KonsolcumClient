import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from './products';
import { RouterModule } from '@angular/router';
import { List } from './list/list';
import { ProductDetailComponent } from './product-detail-component/product-detail-component';



@NgModule({
  declarations: [
    Products,
    List,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {path: ":pageNo", component: List},
        {path: "", component: Products},
        { 
        path: "detail/:id", 
        component: ProductDetailComponent,
        data: { title: 'Ürün Detayı' }
      },
      ]
    )
  ]
})
export class ProductsModule { }
