import { Component, OnInit, ViewChild } from '@angular/core';
import { Base, SpinnerType } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { DialogService } from '../../../../services/common/dialog-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { List_Order } from '../../../../contracts/order/list-order';
import { OrderService } from '../../../../services/common/models/order-service';
import { OrderDetailDialog, OrderDetailDialogState } from '../../../../dialogs/order-detail-dialog/order-detail-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List extends Base implements OnInit {

  constructor(spinner: NgxSpinnerService,private toastr: CustomToastr,private dialogService: DialogService,private orderService : OrderService,private matDialog: MatDialog) {
    super(spinner)
  }

  displayedColumns: string[] = ['orderCode', 'userName','shippingAddress','totalPrice','createdDate', 'isCompleted','viewDetail' ,'delete'];
  dataSource = new MatTableDataSource<List_Order>();
  
  


  //*
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  async ngOnInit(){
    await this.getOrders();
  }
  async pageChanged(){
    await this.getOrders();
  }
  async getOrders(){
    this.showSpinner(SpinnerType.BallAtom);
        const allOrders = await this.orderService.getAllOrders(
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
        this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
        this.paginator.length = allOrders.totalOrderCount;
  }

  async showDetail(id: string) {
  const dialog = this.matDialog.open(OrderDetailDialog, {
    width: '1000px',
    data: id
  });

  // Sadece dialog kapandığında yenile
  dialog.afterClosed().subscribe(result => {
    if (result === 'completed') {
      this.getOrders(); // Listeyi yeniler, güncellenmiş sipariş durumu gelir
    }
  });
}


}
