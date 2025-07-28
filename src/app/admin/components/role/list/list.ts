import { Component, OnInit, ViewChild } from '@angular/core';
import { Base, SpinnerType } from '../../../../base/base';
import { RoleService } from '../../../../services/common/models/role-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { DialogService } from '../../../../services/common/dialog-service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { List_Role } from '../../../../contracts/role/list-role';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-role-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List  extends Base implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private roleService: RoleService,
    private customToastr: CustomToastr,
    private dialogService: DialogService
  ) {
    super(spinner)
  }

  displayedColumns: string[] = ['name', 'delete'];
  dataSource = new MatTableDataSource<List_Role>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public async getRoles() {
    this.showSpinner(SpinnerType.BallAtom);
    
    try {
      // Backend'den gelen response yapısına göre güncellendi
      const response = await this.roleService.getRoles(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => this.hideSpinner(SpinnerType.BallAtom),
        errorMessage =>
          this.customToastr.message(
            errorMessage,
            "Hata!",
            {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            }
          )
      );

      // Backend response formatı: { roles: List_Role[], totalCount: number }
      this.dataSource = new MatTableDataSource<List_Role>(response.roles);
      
      // Paginator'ı güncelle
      if (this.paginator) {
        this.paginator.length = response.totalCount;
        // Sayfa değişikliklerini dinle
        this.paginator.page.subscribe((event: PageEvent) => {
          this.pageChanged(event);
        });
      }

      this.hideSpinner(SpinnerType.BallAtom);
    } catch (error) {
      this.hideSpinner(SpinnerType.BallAtom);
      this.customToastr.message(
        "Roller yüklenirken hata oluştu!",
        "Hata!",
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        }
      );
    }
  }

  async pageChanged(event?: PageEvent) {
    // Sayfa değiştiğinde yeni veriyi yükle
    await this.getRoles();
  }

  async ngOnInit() {
    await this.getRoles();
  }
}
