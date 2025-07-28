import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../../services/common/models/role-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Role } from '../../contracts/role/list-role';
import { SpinnerType } from '../../base/base';
import { UserService } from '../../services/common/models/user-service';

@Component({
  selector: 'app-authorize-user-dialog',
  standalone: false,
  templateUrl: './authorize-user-dialog.html',
  styleUrl: './authorize-user-dialog.scss'
})
export class AuthorizeUserDialog extends BaseDialog<AuthorizeUserDialog> implements OnInit {
  constructor(
    dialogRef: MatDialogRef<AuthorizeUserDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService: UserService,
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
      this.roles = await this.roleService.getRoles(-1, -1);

      if (!this.roles || !this.roles.roles || this.roles.roles.length === 0) {
        this.listRoles = [];
        this.cdr.detectChanges();
        return;
      }
      this.assignedRoles = await this.userService.getRolesToUser(this.data);

      this.listRoles = this.roles.roles.map((r: List_Role) => {
        const isSelected = this.assignedRoles?.includes(r.name) || false;
        return {
          name: r.name,
          selected: isSelected
        };
      });

      this.isLoaded = true;
      this.cdr.detectChanges(); // Değişiklikleri manuel olarak tetikleme
    } catch (error) {
      console.error('Error loading roles:', error);
      console.error('Error details:', error);
    } finally {
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }

  assignRoles(rolesComponent: MatSelectionList) {
    try {
      const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o._elementRef.nativeElement.innerText.trim());
      console.log('Selected roles:', roles);
      
      this.spinner.show(SpinnerType.BallAtom);
      
      this.userService.assignRoleUser(this.data, roles,
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