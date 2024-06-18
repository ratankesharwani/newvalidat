import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  ResetPassword: FormGroup
  forgotData:any
  queueParseData: any
  id:any
  submitted:boolean=false
  alertMessage = ''
  openPop:boolean=false
  AlertMessage=''
  fontColor=''
  hiddenPassword='fa fa-eye-slash'
  hide=true
  passwordType='password'
  hiddenConfirmPassword='fa fa-eye-slash'
  hideConfirm=true
  confirmPasswordType='password'

  constructor(private active: ActivatedRoute, private service: AdminService, private router: Router,private localStorage:LocalStorageService) {
    const queueData:any=this.localStorage.getItem("data")
    this.queueParseData=JSON.parse(queueData)

    const queue:any=this.localStorage.getItem("forgotData")
    this.forgotData=JSON.parse(queue)

    if(this.queueParseData!=null){
      this.id=this.queueParseData.USER_ID
    }
    if(this.forgotData!=null){
      this.id=this.forgotData.USER_ID
    }
    this.ResetPassword = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('PASSWORD_RESET'),
        body: new FormGroup({
          userId: new FormControl(this.id,Validators.required),
          password: new FormControl(null,Validators.required),
          confirmPassword: new FormControl(null,Validators.required)
        })
      })
    })
  }
  get passwordControl() {
    return this.ResetPassword['controls']['request']['controls']['body']['controls']['password'];
  }
  get confirmPasswordControl() {
    return this.ResetPassword['controls']['request']['controls']['body']['controls']['confirmPassword'];
  }

  resetPassword() {
    this.submitted=true
    this.service.login(this.ResetPassword.value).subscribe((data: any) => {
      this.localStorage.removeItem("firstTimeLogin")
      this.submitted=false
      this.openPop=true
      this.fontColor='green'
      this.AlertMessage='Successful !!'
      this.alertMessage=data.MSG
    }, error => {
      this.openPop=true
      this.fontColor='red'
      this.AlertMessage='Warning !!'
      this.alertMessage=error.error.ERROR
    })
  }
  closePopup() {
    this.openPop=false
    if(!this.submitted){
      this.router.navigate(['/'])
    }
  }
  showPassword(){
    if(this.hide){
      this.hiddenPassword='fa fa-eye'
      this.hide=!this.hide
      this.passwordType='text'
    }else {
      this.hiddenPassword='fa fa-eye-slash'
      this.hide=!this.hide
      this.passwordType='password'
    }
  }
  showConfirmPassword(){
    if(this.hideConfirm){
      this.hiddenConfirmPassword='fa fa-eye'
      this.hideConfirm=!this.hideConfirm
      this.confirmPasswordType='text'
    }else {
      this.hiddenConfirmPassword='fa fa-eye-slash'
      this.hideConfirm=!this.hideConfirm
      this.confirmPasswordType='password'
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.resetPassword()
  }
  goToLogin(){
    this.router.navigate(['/login'])
  }
}

