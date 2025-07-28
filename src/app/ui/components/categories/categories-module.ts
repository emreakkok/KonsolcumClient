import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from './categories';
import { RouterModule } from '@angular/router';
import { List } from './list/list';
import { CategoryProducts } from './category-products/category-products';



@NgModule({
  declarations: [
    Categories,
    List,
    CategoryProducts
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        { 
        path: ":pageNo", 
        component: List,
        data: { title: 'Kategoriler' }
      },
      { 
        path: "", 
        component: Categories,
        data: { title: 'Kategoriler' }
      },
      { 
        path: ":categoryId/products/:pageNo", 
        component: CategoryProducts,
        data: { title: 'Kategori Ürünleri' }
      },
      { 
        path: ":categoryId/products", 
        component: CategoryProducts,
        data: { title: 'Kategori Ürünleri' }
      },
      ]
    )
  ]
})
export class CategoriesModule { }
