import { Component, HostListener } from '@angular/core';
import { AdminService } from '../Service/admin.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  queueParseData:any
  SendOTP:FormGroup
  openPop:boolean=false
  AlertMessage=''
  fontColor:any
  alertMessage=''
  submitted:boolean=false
  constructor(private service:AdminService,private router:Router,private localStorage:LocalStorageService) {
    const queueData:any=this.localStorage.getItem("data")
    this.queueParseData=JSON.parse(queueData)

    this.SendOTP=new FormGroup({
      request: new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl('FORGOT_PASSWORD'),
        body:new FormGroup({
          emailId:new FormControl(null,Validators.required),
        })
      })
    })
  }
  sendOTP(){
    this.service.login(this.SendOTP.value).subscribe((data:any)=>{
      this.localStorage.setItem('UserEmailID',this.SendOTP.controls['request'].value.body.emailId)
      this.localStorage.setItem("forgotData", JSON.stringify(data));
      this.localStorage.setItem("OtpValid","true");
      if(data.OTP_SENT){
        this.router.navigate(['/verify-otp'])
      }
    },error=>{
      this.alertMessage = error.error.ERROR
      this.openPop=true
      this.fontColor='red'
      this.AlertMessage='Warning !!'
    })
  }
  closePopup() {
    this.openPop=false
  }
  get emailControl() {
    return this.SendOTP['controls']['request']['controls']['body']['controls']['emailId'];
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.sendOTP()
  }
  goToLogin(){
    this.router.navigate(['/login'])
  }
}
