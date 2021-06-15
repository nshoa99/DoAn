/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {User, UsersService} from '@frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  users : User[] = [];
  endsubs$ : Subject<any> = new Subject();

  constructor(
    private usersService: UsersService, 
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this._getUsers();
  }
  ngOnDestroy() {
    this.endsubs$.next;
    this.endsubs$.complete();
  }
  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa tài khoản này không?',
      header: 'Xóa tài khoản',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).pipe(takeUntil(this.endsubs$)).subscribe(()=>{
          this._getUsers();
          this.messageService.add({severity:'success', summary:'Thành công', detail:'Đã xóa thành công.'});
        },
        () => {
          this.messageService.add({severity:'error', summary:'Lỗi', detail:'Không thể xóa tài khoản!'});
        })
      },
      reject: (type: any) => {
      }
  });
  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`)
  }

  private _getUsers() {
    this.usersService.getUsers().pipe(takeUntil(this.endsubs$)).subscribe((users) => {
      this.users = users;
    })
  }

}
