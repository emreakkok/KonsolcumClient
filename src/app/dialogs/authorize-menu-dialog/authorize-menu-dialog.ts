import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Role } from '../../contracts/role/list-role';
import { MatSelectionList } from '@angular/material/list';
import { SpinnerType } from '../../base/base';
import { RoleService } from '../../services/common/models/role-service';
import { AuthorizationEndpointService } from '../../services/common/models/authorization-endpoint-service';

declare var $: any;

@Component({
  selector: 'app-authorize-menu-dialog',
  standalone: false,
  templateUrl: './authorize-menu-dialog.html',
  styleUrl: './authorize-menu-dialog.scss'
})
export class AuthorizeMenuDialog extends BaseDialog<AuthorizeMenuDialog> implements OnInit {
  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private authorizationEndpointService: AuthorizationEndpointService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    super(dialogRef);
  }
  @ViewChild('rolesComponent') rolesComponent: MatSelectionList;

  roles?: { roles: List_Role[], totalCount: number }; // API response yapısına göre değiştirildi
  assignedRoles: Array<string> = [];
  listRoles: { name: string, selected: boolean }[] = [];
  isLoaded = false;

  async ngOnInit() {
    try {
      this.spinner.show(SpinnerType.BallAtom);
      
      console.log('Dialog data:', this.data);

      // Önce tüm rolleri getir
      console.log('Fetching all roles...');
      this.roles = await this.roleService.getRoles(-1, -1);
      console.log('All roles response:', this.roles);
      console.log('Roles data array:', this.roles?.roles); // datas yerine roles
      console.log('Total count:', this.roles?.totalCount);

      if (!this.roles || !this.roles.roles || this.roles.roles.length === 0) {
        console.warn('No roles found or empty roles array');
        this.listRoles = [];
        this.cdr.detectChanges(); // Change detection trigger
        return;
      }

      // Sonra endpoint'e atanmış rolleri getir
      console.log('Fetching assigned roles for code:', this.data.code, 'menu:', this.data.menuName);
      this.assignedRoles = await this.authorizationEndpointService.getRolesToEndpoint(this.data.code, this.data.menuName);
      console.log('Assigned roles response:', this.assignedRoles);
      

      // Rolleri listele ve seçili olanları işaretle
      this.listRoles = this.roles.roles.map((r: List_Role) => { // datas yerine roles
        const isSelected = this.assignedRoles?.includes(r.name) || false;
        console.log(`Role: ${r.name}, Selected: ${isSelected}`);
        return {
          name: r.name,
          selected: isSelected
        }
      });

      console.log('Final list roles:', this.listRoles);

      this.isLoaded = true;

    } catch (error) {
      console.error('Error loading roles:', error);
      console.error('Error details:', error);
    } finally {
      this.spinner.hide(SpinnerType.BallAtom);
      // Change detection'ı async işlem bittikten sonra tetikle
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  assignRoles(rolesComponent: MatSelectionList) {
    try {
      const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o._elementRef.nativeElement.innerText.trim());
      console.log('Selected roles:', roles);
      
      this.spinner.show(SpinnerType.BallAtom);
      
      this.authorizationEndpointService.assignRoleEndpoint(roles, this.data.code, this.data.menuName,
        () => {
          console.log('Roles assigned successfully');
          this.spinner.hide(SpinnerType.BallAtom);
        }, error => {
          console.error('Error assigning roles:', error);
          this.spinner.hide(SpinnerType.BallAtom);
        })
    } catch (error) {
      console.error('Error in assignRoles:', error);
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }
}