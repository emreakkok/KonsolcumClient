import { Component, OnInit, ViewChild } from '@angular/core';
import { Base, SpinnerType } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../../services/common/models/product-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { DialogService } from '../../../../services/common/dialog-service';
import { MatTableDataSource } from '@angular/material/table';
import { List_Product } from '../../../../contracts/list_product';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectProductImageDialog } from '../../../../dialogs/select-product-image-dialog/select-product-image-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProductDialog } from '../../../../dialogs/update-product-dialog/update-product-dialog';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List extends Base implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private toastr: CustomToastr,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {
    super(spinner)
  }

  displayedColumns: string[] = ['name', 'description', 'price', 'stockQuantity', 'isActive', 'isFeatured', 'categoryName', 'images', 'edit', 'delete'];
  dataSource = new MatTableDataSource<List_Product>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public async getProducts(){
    this.showSpinner(SpinnerType.BallAtom);
    const allProducts : { totalProductCount: number; products: List_Product[] } = await this.productService.read(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5,
      () => this.hideSpinner(SpinnerType.BallAtom),
      errorMessage => 
        this.toastr.message(
          errorMessage,
          "Hata!",
          {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          }
        )
    );
    
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalProductCount;
  }

  async addProductImages(id: string){
    console.log('Product ID to be sent to dialog:', id);
    this.dialogService.openDialog({
      componentType: SelectProductImageDialog,
      data: { productId: id },
      options: {
        width: "1400px"
      },
      afterClosed: () => {
        console.log('SelectProductImageDialog kapatıldı.');
      }
    });
  }

  async pageChanged(event?: PageEvent){
    await this.getProducts();
  }

  async ngOnInit() {
    await this.getProducts();
  }


  openUpdateDialog(product: any): void {
    const dialogRef = this.dialog.open(UpdateProductDialog, {
      width: '500px',
      data: product.id // varsa tüm bilgileri buradan gönder
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(); // Yeniden yükleme yapılacaksa
      }
    });
}
}