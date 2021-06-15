/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@frontend/users';
@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  logoutUser() {
    this.authService.logout();
  }

}
