import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isOpen: boolean = false;
  alertMessage: any
  loginForm: FormGroup
  submitted: boolean = false
  hiddenPassword = 'fa fa-eye-slash'
  hide = true
  passwordType = 'password'
  openPop: boolean = false
  AlertMessage = ''
  fontColor: any
  LoginCredentials: any

  constructor(private service: AdminService, private router: Router,private localStorage:LocalStorageService) {
    this.loginForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('LOGIN', [Validators.required]),
        body: new FormGroup({
          emailId: new FormControl(null, [Validators.required, Validators.email]),
          password: new FormControl(null, [Validators.required]),
        })
      })
    });
  }

  get emailControl() {
    return this.loginForm['controls']['request']['controls']['body']['controls']['emailId'];
  }

  get passControl() {
    return this.loginForm['controls']['request']['controls']['body']['controls']['password'];
  }

  onLogin() {
    this.submitted = true
    this.service.login(this.loginForm.value).subscribe((data: any) => {
      this.submitted = false
      this.LoginCredentials = data
      this.localStorage.setItem("data", JSON.stringify(data));
      this.localStorage.setItem('userId', data.USER_ID)
      this.localStorage.setItem('companyId', data.COMPANY_ID);
      this.localStorage.setItem('userType', data.userType);
      if (this.LoginCredentials?.FIRST_TIME_LOGIN) {
        this.localStorage.setItem("firstTimeLogin", 'true')
        this.router.navigate(['/reset-password']);
      } else {
        if (this.LoginCredentials?.OTP_SENT) {
          this.localStorage.setItem("OtpValid", "true");
          this.router.navigate(['/verify-otp'])
        } else {
          this.alertMessage = "Something went wrong. Please try after some time"
          this.openPop = true
          this.fontColor = 'red'
          this.AlertMessage = 'Warning !!'
        }
      }
    }, error => {
      console.log(error)
      this.alertMessage = error.error.MSG
      this.openPop = true
      this.fontColor = 'red'
      this.AlertMessage = 'Warning !!'
    })
  }

  showPassword() {
    this.hiddenPassword = this.hide ? 'fa fa-eye' : 'fa fa-eye-slash'
    this.passwordType = this.hide ? 'text' : 'password'
    this.hide = !this.hide
  }

  closePopup() {
    this.openPop = false
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.onLogin()
  }
}

