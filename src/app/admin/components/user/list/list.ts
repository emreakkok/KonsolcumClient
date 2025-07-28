import { Component, OnInit, ViewChild } from '@angular/core';
import { Base, SpinnerType } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { DialogService } from '../../../../services/common/dialog-service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { List_User } from '../../../../contracts/users/list-user';
import { UserService } from '../../../../services/common/models/user-service';
import { AuthorizeUserDialog } from '../../../../dialogs/authorize-user-dialog/authorize-user-dialog';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List extends Base implements OnInit {

  constructor(spinner: NgxSpinnerService,private toastr: CustomToastr,private dialogService: DialogService,private userService: UserService,private matDialog: MatDialog) {
    super(spinner)
  }

  displayedColumns: string[] = ['userName', 'nameSurname','email','twoFactorEnabled','role','delete'];
  dataSource = new MatTableDataSource<List_User>();
  
  


  //*
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  async ngOnInit(){
    await this.getUsers();
  }
  async pageChanged(){
    await this.getUsers();
  }
  async getUsers(){
    this.showSpinner(SpinnerType.BallAtom);
        const allUsers = await this.userService.getAllUsers(
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
        this.dataSource = new MatTableDataSource<List_User>(allUsers.users);
        this.paginator.length = allUsers.totalUserCount;
  }

  assignRole(id:string){
    this.dialogService.openDialog({
      componentType: AuthorizeUserDialog,
      data: id,
      options:{
        width:"750px"
      },
      afterClosed: ()=>{

      }
    });
  }



  /*
  async showDetail(id: string) {
  const dialog = this.matDialog.open(OrderDetailDialog, {
    width: '1000px',
    data: id
  });

  // Sadece dialog kapandığında yenile
  dialog.afterClosed().subscribe(result => {
    if (result === 'completed') {
      this.getUsers(); // Listeyi yeniler, güncellenmiş sipariş durumu gelir
    }
  });
}
*/

}

