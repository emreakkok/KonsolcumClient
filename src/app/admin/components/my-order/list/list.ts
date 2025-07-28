import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { MyOrdersService } from '../../../../services/common/models/my-orders-service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderDetailDialog } from '../../../../dialogs/order-detail-dialog/order-detail-dialog';
import { MyOrder } from '../my-order';

@Component({
  selector: 'app-myorder-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  orders: MyOrder[] = [];
  totalOrderCount: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  loading: boolean = false;
  userName: string = '';
  displayedColumns: string[] = ['orderCode', 'createdDate', 'totalPrice', 'isCompleted', 'actions'];

  constructor(
    private myOrdersService: MyOrdersService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toastr: CustomToastr,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
  this.spinner.show();
  this.loading = true;

  this.myOrdersService.getMyOrders(this.currentPage, this.pageSize).then(response => {
  this.orders = response.orders;
  this.totalOrderCount = response.totalOrderCount;
  this.userName = response.userName;
  this.loading = false;
  this.spinner.hide();
  this.cdRef.detectChanges();  // ekle
}).catch(error => {
    this.toastr.message(
      error.message || 'Siparişler yüklenirken bir hata oluştu.',
      'Hata!',
      {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      }
    );
    this.loading = false;
    this.cdRef.detectChanges(); 
    this.spinner.hide();
  });
}


  viewOrderDetail(orderId: string): void {
    const dialogRef = this.dialog.open(OrderDetailDialog, {
      data: orderId,
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'completed') {
        this.loadMyOrders(); // Listeyi yenile
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMyOrders();
  }

  get totalPages(): number {
    return Math.ceil(this.totalOrderCount / this.pageSize);
  }
}