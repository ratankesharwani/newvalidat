import { Component } from '@angular/core';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FilterbuttonComponent } from "../filterbutton/filterbutton.component";
import { FooterComponent } from "../footer/footer.component";
import { FiltersidebarComponent } from "../filtersidebar/filtersidebar.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-payin-services',
    standalone: true,
    templateUrl: './payin-services.component.html',
    styleUrl: './payin-services.component.css',
    imports: [
      InnerheaderComponent,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      FilterbuttonComponent,
      RouterOutlet,
      RouterLink,
      RouterLinkActive,
      FooterComponent,
      FiltersidebarComponent]
})
export class PayinServicesComponent {
    lock: string | boolean
    lockForm: FormGroup
    PaymentInDetailsByIdForm: FormGroup
    currentUser = "Current User"
    queueParseData: any
    loginData: any
    Toggle: boolean = false
    lockedByCurrentUser: boolean = false
    accountDetailsContComponent: any
    formBlock:boolean=true
    systemAdmin:any
    paymentInDetailsAction:any
  
    constructor(private service: AdminService,private localStorage:LocalStorageService) {
  
      const queueData: any = this.localStorage.getItem("queueData")
      this.queueParseData = JSON.parse(queueData)
  
      const loginData: any = this.localStorage.getItem("data")
      this.loginData = JSON.parse(loginData)
  
      this.systemAdmin = this.loginData?.USER_TYPE==="System Admin"
  
      this.lockForm = new FormGroup({
        request: new FormGroup({
          module: new FormControl('COMPLIANCE', [Validators.required]),
          subModule: new FormControl('LOCK_UNLOCK', [Validators.required]),
          body: new FormGroup({
            updatedBy: new FormControl(this.loginData?.USER_ID),
            moduleName:new FormControl('PAYMENT_IN'),
            cpilRequest: new FormArray(
              [])
          })
        })
      })
      this.PaymentInDetailsByIdForm = new FormGroup({
        request: new FormGroup({
          module: new FormControl('COMPLIANCE', [Validators.required]),
          subModule: new FormControl('PAYMENT_IN_DETAIL_BY_ID', [Validators.required]),
          body: new FormGroup({
            id: new FormControl(this.queueParseData?.id, [Validators.required]),
          })
        })
      });
    }
    ngOnInit(){
      this.checkLockedBy()
    }
    toggle(event) {
      this.lockForm.value.request.body.cpilRequest.push({integrationId: this.queueParseData?.id, lock: event.target.checked})
      this.service.menuPanel(this.lockForm.value).subscribe((data) => {
        if(this.accountDetailsContComponent.actionOnClear){this.accountDetailsContComponent.onToggleLock(event.target.checked)}
        this.lockedByCurrentUser = !event.target.checked
        this.lockForm.value.request.body.cpilRequest.pop()
        this.toggleLockCheck()
        this.checkLockedBy()
        if(this.queueParseData?.status==='CLEAR'){
          this.blockForm()
        }
      }, error => {
        this.lockForm.value.request.body.cpilRequest.pop()
        console.log(error)
      })
    }
    checkLockedBy(){
      this.service.menuPanel(this.PaymentInDetailsByIdForm.value).subscribe(response => {
        this.localStorage.setItem("paymentInDetailsAction",JSON.stringify(response.ACTION));
        this.toggleLockCheck();
      }, error => {
        console.log(error)
      })
    }
    onActivate(event: any) {
      this.accountDetailsContComponent = event
      if (this.accountDetailsContComponent.actionOnClear) {
        this.accountDetailsContComponent?.onToggleLock(this.queueParseData?.lock && (this.queueParseData?.lockedBy === this.loginData?.USER_ID))
      }
      this.accountDetailsContComponent.stateChanged?.subscribe((data:any) => {
        this.accountDetailsContComponent.onToggleLock(data)
        this.Toggle = data
      })
      this.accountDetailsContComponent.onClear?.subscribe((data)=>{
        this.formBlock=data
        if(!this.formBlock){
          this.blockForm()
        }
      })
    }
    blockForm() {
      if(!this.systemAdmin){
        const element = document.getElementById('toggle')
        element?.style.setProperty("pointer-events", "none")
        element?.style.setProperty("opacity", "50%")
      }
    }
    onDeactivate(event: any) {
    }
    toggleLockCheck(){
      const paymentInDetails: any = this.localStorage.getItem("paymentInDetailsAction")
      this.paymentInDetailsAction = JSON.parse(paymentInDetails)
      this.lock = this.paymentInDetailsAction?.IS_LOCK
      if (this.paymentInDetailsAction?.LOCKED_BY_ID != this.loginData?.USER_ID) {
        this.currentUser = this.paymentInDetailsAction?.LOCKED_BY
      } else {
        this.lockedByCurrentUser = true
      }
    }
  }
  
