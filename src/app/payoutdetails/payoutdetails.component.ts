import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.prod';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payoutdetails',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './payoutdetails.component.html',
  styleUrl: './payoutdetails.component.css'
})
export class PayoutdetailsComponent {

  @Output() public stateChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onClear: EventEmitter<any> = new EventEmitter<any>();
  payoutDetails: FormGroup;
  status: FormGroup;
  reason: FormGroup;
  applyAndUnlock: FormGroup;
  applyAndUnlockResponse : any;
  reasonResponse: any;
  statusResponse: any;
  payoutDetailsActionResponse: any;
  payoutBankDetails:any
  payoutBeneDetails:any
  payoutOthersDetails:any
  queueParseData: any;
  loginData : any;
  displayConfirm: boolean = false
  actionOnClear: boolean = true;
  AlertMessage = ''
  openPop: boolean = false
  fontColor = 'red';
  alertMessage = '';
  submitted: boolean = false;
  reasonClear:boolean=false

  constructor(private service: AdminService) {

    const queueDataa: any = localStorage.getItem("payoutData")
    this.queueParseData = JSON.parse(queueDataa);


    const loginData: any = localStorage.getItem("data")
    this.loginData = JSON.parse(loginData)

    this.applyAndUnlock = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('APPLY_AND_UNLOCK'),
        body: new FormGroup({
          lockedBy: new FormControl(this.loginData.USER_ID),
          integrationId: new FormControl(this.queueParseData.id),
          moduleName: new FormControl('PAYMENT_OUT'),
          complianceLog: new FormControl(null),
          complianceStatusId: new FormControl(null),
          complianceReasonId: new FormControl(null),
          note: new FormControl(null),
          locked: new FormControl(true),
        })
      })
    });

    this.payoutDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMP_PAYOUT_DETAILS_BY_ID'),
        body: new FormGroup({
          payoutId: new FormControl(this.queueParseData.id),
        })
      })
    });

    this.status = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl("PaymentOutStatus"),
        })
      })
    });

    this.reason = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SUB_STATUS_DROPDOWN'),
        body: new FormGroup({
          sysLookupDetailsId: new FormControl(),
        })
      })
    });
  }


  ngOnInit() {
    this.service.payInList(this.status.value).subscribe((response:any) => {
      this.statusResponse = response;
    }, error => {
      console.log(error)
    })
    this.service.menuPanel(this.payoutDetails.value).subscribe(response => {
      localStorage.setItem("paymentOutDetailsAction",JSON.stringify(response.ACTION));
      this.payoutDetailsActionResponse = response.ACTION;
      this.payoutBankDetails=response.BANK_DETAILS
      this.payoutBeneDetails=response.BENE_DETAILS
      this.payoutOthersDetails=response.OTHERS
      this.statusIdByStatus(this.payoutDetailsActionResponse.STATUS)
      this.stateChanged.emit(this.loginData.USERNAME === response.ACTION?.LOCKED_BY && response.ACTION.IS_LOCK)
      if (response.ACTION.STATUS === 'CLEAR') {
        this.actionOnClear = !this.actionOnClear
        this.onClear.emit(false)
        this.blockForm()
      } else {
        this.onClear.emit(true)
      }
      this.applyAndUnlock.patchValue({request: {body: {complianceReasonId: this.payoutDetailsActionResponse?.REASON_ID}}})

    }, error => {
      console.log(error)
    })
  }

  blockForm() {
    const element = document.getElementById('fill-form')
    element?.style.setProperty("pointer-events", "none")
    element?.style.setProperty("opacity", "50%")
  }

  unblockForm() {
    if (this.actionOnClear) {
      const element = document.getElementById('fill-form')
      element?.style.setProperty("pointer-events", "auto")
      element?.style.setProperty("opacity", "100%")
    }
  }

  onToggleLock(status: any) {
    status?this.unblockForm():this.blockForm()
  }

  applyAndLock(){
    this.applyAndUnlock.patchValue({request: {body: {locked: !this.reasonClear}}})
    this.service.menuPanel(this.applyAndUnlock.value).subscribe(response => {
      this.applyAndUnlockResponse = response;
      this.fontColor = 'green'
      this.AlertMessage = 'Successful'
      this.openPop = true
      this.alertMessage = response?.response;
    }, error => {
      console.log(error)
      this.fontColor = 'red'
      this.AlertMessage = 'Error'
      this.openPop = true
      this.alertMessage = error.error.message || error.error?.ERROR
    })
  }

  applyNUnlock(){
    this.applyAndUnlock.patchValue({request: {body: {locked: false}}})
    this.service.serviceDetails(this.applyAndUnlock.value).subscribe(response => {
      this.applyAndUnlockResponse = response;
      this.fontColor = 'green'
      this.AlertMessage = 'Successful'
      this.openPop = true
      this.alertMessage = response?.response;
    }, error => {
      console.log(error)
      this.fontColor = 'red'
      this.AlertMessage = 'Error'
      this.openPop = true
      this.alertMessage = error.error.message || error.error?.ERROR
    })
  }

  statusValue(data: any) {
    this.reasonClear=this.statusResponse.find(x=>x.id===data).display_field==='CLEAR'
    this.reason.controls['request'].value.body.sysLookupDetailsId = data;
    this.service.payInList(this.reason.value).subscribe((response) => {
      this.reasonResponse = response;
      this.insertionSort(this.reasonResponse);
    }, error => {
      console.log(error)
    })
  }
  statusIdByStatus(data: any) {
    for(let i = 0 ;  i< this.statusResponse?.length;  i++){
      if (this.statusResponse[i]?.display_field === data) {
        this.statusValue(this.statusResponse[i]?.id)
        this.applyAndUnlock.patchValue({request: {body: {complianceStatusId: this.statusResponse[i]?.id}}})
      }
    }
  }

  insertionSort(array: any[]): void {
    for(let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current?.display_field < array[j]?.display_field && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }
  closePopup() {
    this.openPop = false
    this.ngOnInit()
  }
  get Url(){
    if(environment.complianceUrl.split("/")[2]==='paragon.xend.com')
    {
     return  'https://secure.xend.com/admin/'
    }else {
     return  'https://uat.xend.com/admin/'
    }
  }
  toXend(otherDetails:any){
    if(otherDetails.display==='Client Id'){
      window.open(this.Url+'clients/'+otherDetails.value)
    }
    if(otherDetails.display==='Deal Id'){
      window.open(this.Url+'deals/'+otherDetails.value)
    }
  }
}
