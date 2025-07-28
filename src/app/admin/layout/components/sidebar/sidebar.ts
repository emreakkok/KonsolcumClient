import { Component } from '@angular/core';
import { AuthService } from '../../../../services/common/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  constructor(public authService: AuthService){
    
  }
}
