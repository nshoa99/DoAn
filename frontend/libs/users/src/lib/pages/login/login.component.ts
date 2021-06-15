/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  
  loginFormGroup: any;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email hoặc Mật khẩu sai.'

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private localstorageService: LocalstorageService,
              private router: Router) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm(){
    this.loginFormGroup = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  get loginForm() {
    return this.loginFormGroup?.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.loginFormGroup.invalid ) return;
    const loginData = {
      email: this.loginForm.email.value,
      password: this.loginForm.password.value
    }

    this.auth.login(loginData.email, loginData.password).subscribe(user => {
      this.authError = false;
      this.localstorageService.setToken(user.token);
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse)=>{

      this.authError = true;
      if(error.status !== 400){
        this.authMessage = "Lỗi hệ thống!"
      }
    })
  }
}
