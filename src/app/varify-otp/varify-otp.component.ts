import { Component, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { CdTimerModule } from 'angular-cd-timer';

@Component({
  selector: 'app-varify-otp',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,CdTimerModule],
  templateUrl: './varify-otp.component.html',
  styleUrl: './varify-otp.component.css'
})
export class VarifyOtpComponent {
  @ViewChild('basicTimer') timer :any
  queueParseData:any
  forgotData:any
  OTPForm:FormGroup
  submitted:boolean=false
  id:any
  resendOTP:FormGroup
  alertMessage = ''
  openPop:boolean=false
  AlertMessage=''
  fontColor=''
  emailId:any
  constructor(private service:AdminService,
              private router:Router,private localStorage:LocalStorageService) {

    const queueData:any=this.localStorage.getItem("data")
    this.queueParseData=JSON.parse(queueData)

    const queue:any=this.localStorage.getItem("forgotData")
    this.forgotData=JSON.parse(queue)

   if(this.queueParseData!=null){
     this.id=this.queueParseData.USER_ID
     this.emailId=this.queueParseData.EMAIL_ID
   }
   if(this.forgotData!=null){
     this.id=this.forgotData.USER_ID
     this.emailId=this.localStorage.getItem('UserEmailID')
   }
    this.OTPForm=new FormGroup({
      request: new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl('OTP_CHECK'),
        body:new FormGroup({
          userId:new FormControl(this.id),
          otp:new FormControl(null,Validators.maxLength(4))
        })
      })
    })
    this.resendOTP=new FormGroup({
      request: new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl('FORGOT_PASSWORD'),
        body:new FormGroup({
          emailId:new FormControl(this.emailId),
        })
      })
    })
  }
  password;
  show = false;
  ngOnInit() {
    this.password = 'password';
    const element = document.getElementById('resend')
    element?.style.setProperty("pointer-events","none")
    element?.style.setProperty("opacity",'0.5')
  }
  get otpControl() {
    return this.OTPForm['controls']['request']['controls']['body']['controls']['otp'];
  }
  resentOTP(){
    this.service.login(this.resendOTP.value).subscribe((data)=>{
      this.timer.start()
      const element = document.getElementById('resend')
      element?.style.setProperty("pointer-events","none")
      element?.style.setProperty("opacity",'0.5')
      this.localStorage.setItem("OtpValid","true");
      this.openPop=true
      this.fontColor='green'
      this.AlertMessage='Successful !!'
      this.alertMessage="Otp has been sent to your mail"
    },error=>{
      this.openPop=true
      this.fontColor='red'
      this.AlertMessage='Warning !!'
      this.alertMessage=error.error.ERROR
    })
  }
  sendOTP(){
    this.submitted=true
    this.service.login(this.OTPForm.value).subscribe((data:any)=>{
      this.submitted=false
      this.localStorage.setItem("OtpValid",'true')
      if(this.queueParseData!=null){
        if(!this.queueParseData.FIRST_TIME_LOGIN){
          this.localStorage.setItem("isLoggedIn",'true')
          this.router.navigate(['/Admin'],{queryParams:{data:true}})
        }
        else {
          this.router.navigate(['/reset-password'],{queryParams:{data:this.id}})
        }
      }else {
        if(this.localStorage.getItem('forgotData')){
          this.router.navigate(['/reset-password'],{queryParams:{data:this.id}})
        }
      }
    },error => {
      this.openPop=true
      this.fontColor='red'
      this.AlertMessage='Warning !!'
      this.alertMessage=error.error.ERROR
    })
  }
  closePopup() {
    this.openPop=false
  }
  onTimerStop(){
    const element = document.getElementById('resend')
    element?.style.setProperty("pointer-events","auto")
    element?.style.setProperty("opacity",'1')
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.sendOTP()
  }
  goToLogin(){
    this.router.navigate(['/login'])
  }
}


