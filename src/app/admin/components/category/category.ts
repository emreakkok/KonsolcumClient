import { Component, ViewChild } from '@angular/core';
import { Base } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../../../services/common/http-client-service';
import { CustomToastr } from '../../../services/common/custom-toastr';
import { List } from './list/list';

@Component({
  selector: 'app-admin-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.scss'
})
export class Category extends Base{

  @ViewChild('categoryList') categoryList!: List;

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService, private customToastr: CustomToastr) {
        super(spinner);

      }

  onCategoryCreated() {
    if (this.categoryList) {
      this.categoryList.getCategories(); // List bileşeninin kategorileri yeniden yükleme metodu
    }
  }

}
