import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products-module';
import { OrderModule } from './order/order-module';
import { CustomerModule } from './customer/customer-module';
import { DashboardModule } from './dashboard/dashboard-module';
import { CategoryModule } from './category/category-module';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu-module';
import { RoleModule } from './role/role-module';
import { UserModule } from './user/user-module';
import { MyOrderModule } from './my-order/my-order-module';




@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CategoryModule,
    ProductsModule,
    OrderModule,
    CustomerModule,
    DashboardModule,
    AuthorizeMenuModule,
    RoleModule,
    UserModule,
    MyOrderModule
  ]
})
export class ComponentsModule { }
