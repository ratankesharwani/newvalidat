import { Component, EventEmitter, Output } from '@angular/core';
import { PayindetailsformComponent } from '../payindetailsform/payindetailsform.component';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-payindetails',
    standalone: true,
    templateUrl: './payindetails.component.html',
    styleUrl: './payindetails.component.css',
    imports: [
        PayindetailsformComponent,
        InnerheaderComponent,CommonModule,FormsModule,ReactiveFormsModule
    ]
})
export class PayindetailsComponent {
  @Output() public stateChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onClear: EventEmitter<any> = new EventEmitter<any>();
  paymentInReasonForm: FormGroup
  PaymentInDetailsByIdForm: FormGroup
  whiteListForm: FormGroup
  paymentInStatusForm: FormGroup
  applyNUnlock: FormGroup
  paymentInDetailsAction: any
  lockForm: FormGroup;
  paymentInStatusDropdown: any
  paymentInReasonDropdown: any
  queueParseData: any
  alertMessage = ''
  Status: any
  AlertMessage = ''
  openPop: boolean = false
  fontColor = 'red'
  ApplyClear: any
  submitted: boolean = false
  actionOnClear: boolean = true
  loginData: any
  lockedBy: any
  payinCustomerDetails: any
  payinSenderDetails: any
  payinOtherDetails: any
  reasonClear:boolean=false

  constructor(private service: AdminService,private localStorage:LocalStorageService) {

    const queueDataa: any = localStorage.getItem("queueData")
    this.queueParseData = JSON.parse(queueDataa)

    const loginData: any = this.localStorage.getItem("data")
    this.loginData = JSON.parse(loginData)

    this.lockForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('PAYMENT_IN_LOCK', [Validators.required]),
        body: new FormGroup({
          updatedBy: new FormControl(this.loginData?.USER_ID),
          cpilRequest: new FormArray(
            [])
        })
      })
    })
    this.applyNUnlock = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('APPLY_AND_UNLOCK', [Validators.required]),
        body: new FormGroup({
          lockedBy: new FormControl(this.loginData?.USER_ID),
          integrationId: new FormControl(this.queueParseData?.id),
          moduleName: new FormControl('PAYMENT_IN'),
          complianceLog: new FormControl(null),
          complianceStatusId: new FormControl(null),
          complianceReasonId: new FormControl(null),
          note: new FormControl(null),
          locked: new FormControl(true),
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

    this.paymentInStatusForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN', [Validators.required]),
        body: new FormGroup({
          sysLookupName: new FormControl('PaymentInStatus', [Validators.required])
        })
      })
    });

    this.paymentInReasonForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('SUB_STATUS_DROPDOWN', [Validators.required]),
        body: new FormGroup({
          sysLookupDetailsId: new FormControl(null, [Validators.required])
        })
      })
    });

    this.whiteListForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('WHITELIST_DETAILS_CREATE', [Validators.required]),
        body: new FormGroup({
          description: new FormControl(null, Validators.required),
          status: new FormControl(true, Validators.required),
          clientId: new FormControl(null),
          bankName: new FormControl(),
          debtorCountry: new FormControl(),
          createdBy: new FormControl(this.loginData?.USER_ID, Validators.required),
          accountNumber: new FormControl(),
          debtorName: new FormControl(),
          currencyCode: new FormControl(),
        })
      })
    })
  }

  get descControl() {
    return this.whiteListForm['controls']['request']['controls']['body']['controls']['description'];
  }

  ngOnInit() {
    this.whiteListForm.controls['request'].value.body.description = '';
    this.lockedBy = this.queueParseData?.lockedBy
    this.service.menuPanel(this.paymentInStatusForm.value).subscribe((data) => {
      this.paymentInStatusDropdown = data
    })
    this.service.menuPanel(this.PaymentInDetailsByIdForm.value).subscribe(data => {
      this.payinCustomerDetails = data.CUSTOMER_DETAILS;
      this.payinSenderDetails = data.SENDER_DETAILS
      this.payinOtherDetails = data.OTHER_DETAILS;
      this.paymentInDetailsAction = data.ACTION;
      this.localStorage.setItem("paymentInDetailsAction",JSON.stringify(data.ACTION));
      this.stateChanged.emit(this.loginData?.USERNAME === data.ACTION?.LOCKED_BY && data.ACTION.IS_LOCK)
      if (data.ACTION.STATUS === 'CLEAR') {
        this.actionOnClear = !this.actionOnClear
        this.onClear.emit(false)
        this.blockForm()
      } else {
        this.onClear.emit(true)
      }
      this.applyNUnlock.patchValue({request: {body: {complianceReasonId: this.paymentInDetailsAction?.REASON_ID}}})
      this.statusIdByStatus(this.paymentInDetailsAction.STATUS)
    }, error => {
      console.log(error)
    })
  }

  statusIdByStatus(data: any) {
    const setTime = setTimeout(() => {
      const id = this.paymentInStatusDropdown.find(x => x.display_field === data).id
      if (id) {
        this.applyNUnlock.patchValue({request: {body: {complianceStatusId: id}}})
        this.reasonByStatusId(id)
      }
      clearTimeout(setTime)
    }, 200)
  }

  reasonByStatusId(id: any) {
    this.reasonClear=this.paymentInStatusDropdown.find(x=>x.id===id).display_field==='CLEAR'
    this.paymentInReasonForm.patchValue({request: {body: {sysLookupDetailsId: id}}})
    this.service.menuPanel(this.paymentInReasonForm.value).subscribe(data => {
      this.paymentInReasonDropdown = data
      this.insertionSort(this.paymentInReasonDropdown)
    }, error => {
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

  applyAndUnlock() {
    this.applyNUnlock.patchValue({request: {body: {locked: false}}})
    this.service.menuPanel(this.applyNUnlock.value).subscribe((data) => {
      this.ApplyClear = data
      // if (this.ApplyClear?.whiteListData) {
      //   this.fillWhitelistForm()
      //   this.blockForm()
      //   this.openModal()
      //   this.stateChanged.emit(false)
      // } else
      // {
      this.AlertMessage = 'Successful'
      this.openPop = true
      this.fontColor = 'green'
      this.alertMessage = data?.response
      this.blockForm()
      this.stateChanged.emit(false)
      // }
    }, error1 => {
      this.fontColor = 'red'
      this.AlertMessage = 'Error'
      this.openPop = true
      this.alertMessage = error1.error.message || error1.error?.ERROR
    })
  }

  applyAndLock() {
    this.applyNUnlock.patchValue({request: {body: {locked: !this.reasonClear}}})
    this.service.menuPanel(this.applyNUnlock.value).subscribe((data) => {
        this.ApplyClear = data
        // if (this.ApplyClear?.whiteListData) {
        //   this.fillWhitelistForm();
        //   this.openModal()
        // } else {

        this.fontColor = 'green'
        this.AlertMessage = 'Successful'
        this.openPop = true
        this.alertMessage = data?.response
        // }
      }, error1 => {
        this.fontColor = 'red'
        this.AlertMessage = 'Error'
        this.openPop = true
        this.alertMessage = error1.error.message || error1.error?.ERROR
      }
    )
  }

  fillWhitelistForm() {
    this.whiteListForm.patchValue({
      request: {
        body: {
          clientId: this.ApplyClear.whiteListData.clientId,
          bankName: this.ApplyClear.whiteListData.bankName,
          debtorCountry: this.ApplyClear.whiteListData.debtorCountry,
          accountNumber: this.ApplyClear.whiteListData.accountNumber,
          debtorName: this.ApplyClear.whiteListData.debtorName,
          currencyCode: this.ApplyClear.whiteListData.currencyCode
        }
      }
    })
  }

  closePopup() {
    this.openPop = false
    this.ngOnInit()
  }

  displayWhitelist: boolean = false
  displayConfirm: boolean = false

  openModal() {
    this.displayWhitelist = !this.displayWhitelist
  }

  closeModal() {
    this.displayWhitelist = !this.displayWhitelist
    this.clearDesc()
  }

  clearDesc() {
    this.whiteListForm.controls['request'].value.body.description = '';
  }

  openConfirmModal() {
    this.submitted = this.descControl.invalid
    if (!this.submitted) {
      this.displayConfirm = !this.displayConfirm
    }
  }

  closeConfirmModal() {
    this.displayConfirm = !this.displayConfirm
    this.clearDesc()
  }

  createConfirmWhitelist() {
    this.service.createWhitelist(this.whiteListForm.value).subscribe((data) => {
      this.closeModal();
      this.closeConfirmModal();
      this.openPop = true
      this.alertMessage = "Whitelist created successfully"
      this.AlertMessage = 'Successful !!'
      this.fontColor = 'green'
    }, error => {
      console.log(error)
    })
  }

  onToggleLock(status: any) {
    status?this.unblockForm():this.blockForm()
  }

  insertionSort(array: any[]): void {
    for (let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current?.display_field < array[j]?.display_field && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }
}
