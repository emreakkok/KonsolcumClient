import { Component, OnInit } from '@angular/core';
import { Base } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../../services/common/dialog-service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ApplicationService } from '../../../services/common/models/application-service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AuthorizeMenuDialog } from '../../../dialogs/authorize-menu-dialog/authorize-menu-dialog';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface ITreeMenu {
  name: string; // undefined kaldırıldı
  actions?: ITreeMenu[];
  code?: string;
  menuName?: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  code?: string; // code alanı eklendi
  menuName?: string;
}

@Component({
  selector: 'app-authorize-menu',
  standalone: false,
  templateUrl: './authorize-menu.html',
  styleUrl: './authorize-menu.scss'
})
export class AuthorizeMenu extends Base implements OnInit{

  constructor(spinner: NgxSpinnerService, private applicationService: ApplicationService, private dialogService: DialogService) {
    super(spinner)
  }

  async ngOnInit() {
    this.dataSource.data = await (await this.applicationService.getAuthorizeDefinitionEndpoints())
      .map(m => {
        const treeMenu: ITreeMenu = {
          name: m.name || '', // null/undefined kontrolü
          actions: m.actions.map(a => {
            const _treeMenu: ITreeMenu = {
              name: a.definition || '', // null/undefined kontrolü
              code: a.code,
              menuName: m.name
            }
            return _treeMenu;
          })
        };
        return treeMenu;
      });
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (menu: ITreeMenu, level: number): ExampleFlatNode => { // return type belirtildi
      return {
        expandable: !!menu.actions && menu.actions.length > 0, // undefined kontrolü
        name: menu.name, // artık her zaman string
        level: level,
        code: menu.code,
        menuName: menu.menuName
      };
    },
    menu => menu.level,
    menu => menu.expandable,
    menu => menu.actions || [] // undefined yerine boş array döndür
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  assignRole(code: string, name: string, menuName:string) {
    this.dialogService.openDialog({
      componentType: AuthorizeMenuDialog,
      data: { code: code, name: name ,menuName:menuName},
      options: {
        width: "750px"
      },
      afterClosed: () => {

      }
    });
  }
}

export class Menu {
    name: string;
    actions : Action[];
}

export class Action{
    actionType: string;
    httpType: string;
    definition: string;
    code: string;
}