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
    selector: 'app-payout-services',
    standalone: true,
    templateUrl: './payout-services.component.html',
    styleUrl: './payout-services.component.css',
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
export class PayoutServicesComponent {
    lock : boolean;
    loginData : any;
    queueParseData : any;
    currentUser = "Current User";
    lockedByCurrentUser: boolean = false;
    Toggle: boolean = false
    lockForm : FormGroup;
    lockFormResponse : any;
    accountDetailsContComponent: any;
    formBlock:boolean=true
    systemAdmin:any
    paymentOutDetailsAction:any
    payoutDetails: FormGroup
  
    constructor(private service: AdminService,private localStorage:LocalStorageService) {
      const queueData: any = this.localStorage.getItem("payoutData")
      this.queueParseData = JSON.parse(queueData);
  
      const loginData: any = this.localStorage.getItem("data")
      this.loginData = JSON.parse(loginData);
  
      this.systemAdmin = this.loginData?.USER_TYPE==="System Admin"
  
      this.lockForm = new FormGroup({
        request: new FormGroup({
          module: new FormControl('COMPLIANCE', [Validators.required]),
          subModule: new FormControl('LOCK_UNLOCK', [Validators.required]),
          body: new FormGroup({
            updatedBy: new FormControl(this.loginData?.USER_ID),
            moduleName: new FormControl('PAYMENT_OUT'),
            cpilRequest: new FormArray(
              [])
          })
        })
      })
  
      this.payoutDetails = new FormGroup({
        request: new FormGroup({
          module: new FormControl('COMPLIANCE'),
          subModule: new FormControl('COMP_PAYOUT_DETAILS_BY_ID'),
          body: new FormGroup({
            payoutId: new FormControl(this.queueParseData?.id),
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
      }, error => {
        console.log(error)
      })
    }
    checkLockedBy(){
      this.service.menuPanel(this.payoutDetails.value).subscribe(response => {
        this.localStorage.setItem("paymentOutDetailsAction",JSON.stringify(response.ACTION));
        this.toggleLockCheck();
        this.Toggle = this.paymentOutDetailsAction?.IS_LOCK
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
      })
    }
    toggleLockCheck(){
      const paymentInDetails: any = localStorage.getItem("paymentOutDetailsAction")
      this.paymentOutDetailsAction = JSON.parse(paymentInDetails)
      this.lock = this.paymentOutDetailsAction?.IS_LOCK
      if (this.paymentOutDetailsAction?.LOCKED_BY_ID != this.loginData?.USER_ID) {
        this.currentUser = this.paymentOutDetailsAction?.LOCKED_BY
      } else {
        this.lockedByCurrentUser = true
      }
    }
  }
  
