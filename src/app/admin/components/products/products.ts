import { Component, ViewChild } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../../../services/common/http-client-service';
import { Create_Product } from '../../../contracts/create_product';
import { List } from './list/list';
import { CustomToastr } from '../../../services/common/custom-toastr';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products extends Base {

  @ViewChild('productList') productList!: List;

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService, private customToastr: CustomToastr) {
    super(spinner);
  }

  onProductCreated() {
    if (this.productList) {
      this.productList.getProducts();
    }
  }
}
