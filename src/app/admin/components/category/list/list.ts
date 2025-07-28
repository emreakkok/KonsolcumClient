import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { List_Category } from '../../../../contracts/category/list_category';
import { CategoryService } from '../../../../services/common/models/category-service';
import { Base, SpinnerType } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from '../../../../services/common/dialog-service';
import { SelectCategoryImageDialog } from '../../../../dialogs/select-category-image-dialog/select-category-image-dialog';
import { UpdateCategoryDialog } from '../../../../dialogs/update-category-dialog/update-category-dialog';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List extends Base implements OnInit {

  constructor(spinner: NgxSpinnerService,private categoryService: CategoryService,private toastr: CustomToastr,private dialogService: DialogService,private dialog: MatDialog) {
    super(spinner)
  }

  displayedColumns: string[] = ['name', 'description', 'isActive', 'images' ,'edit', 'delete'];
  dataSource = new MatTableDataSource<List_Category>();
  

  //*
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // admin list.ts

  public async getCategories(){
    this.showSpinner(SpinnerType.BallAtom);
    const allCategories = await this.categoryService.read(
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
    this.dataSource = new MatTableDataSource<List_Category>(allCategories.categories);
    this.paginator.length = allCategories.totalCategoryCount;
  }


  async addCategoryImages(id: string){
    console.log('Category ID to be sent to dialog:', id);
    this.dialogService.openDialog({
      componentType: SelectCategoryImageDialog,
      data: { categoryId: id },
      options: {
        width: "1400px"
      },
      afterClosed: () => {
        console.log('SelectCategoryImageDialog kapatıldı.');
      }
    });
  }

  async pageChanged(){
    await this.getCategories();
  }

  async ngOnInit() {
     await this.getCategories();
  }

  openUpdateDialog(category: any): void {
  const dialogRef = this.dialog.open(UpdateCategoryDialog, {
    width: '300px',
    data: category.id // varsa tüm bilgileri buradan gönder
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getCategories(); // Yeniden yükleme yapılacaksa
    }
  });


}
}
