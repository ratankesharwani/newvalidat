import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import moment from 'moment';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import { DownloadService } from '../Service/download.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { FiltersidebarComponent } from "../filtersidebar/filtersidebar.component";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

@Component({
    selector: 'app-paymentin',
    standalone: true,
    templateUrl: './paymentin.component.html',
    styleUrl: './paymentin.component.css',
    providers: [DatePipe],
    imports: [CommonModule, ReactiveFormsModule, FiltersidebarComponent,FormsModule,BsDatepickerModule]
})
export class PaymentinComponent {
  @Input() toggleButton:boolean=false
  @ViewChild('paginator') paginator: MatPaginator
  payInForm: FormGroup;
  lockForm: FormGroup;
  payIn: any
  senderType: any
  PageNumber: number = 0;
  TotalElements: any;
  NumberOfElement: number = 20
  page: any
  selected: boolean[] = []
  lockedData: any[] = []
  checkedAll: boolean;
  ComplianceStatus: FormGroup
  senderTypeForm: FormGroup
  IsLocked: FormGroup
  ServiceCheck: FormGroup
  currentDate = this.datepipe.transform((new Date), 'MM/dd/yyyy');
  Locking: any
  displayed: boolean = false
  routeData: any
  complianceStatus: any
  blackListCheck: any
  maxDate = new Date();
  transactionDateRange: any
  createdDateRange: any
  ComplianceFilteredData={
    senderType:null,
    status:null,
    isLocked:null,
    lockedBy:null,
    createdDate:null,
    allocatedCustomerId:null,
    customerName:null,
    amount:null,
    bank:null,
    currencyCode:null,
    allocatedDealId:null,
    bankRefNo:null,
    debtorAccountNumber:null,
    debtorName:null,
    transactionDate:null,
    clearedByName:null,
    blacklistCheck:null,
    thirdPartyCheck:null,
    sanctionCheck:null,
    cifasCheck:null,
  }
  tabColumns=[
    {
      name:"Receiver`s bank",
      key:'bank',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Amount received",
      key:'amount',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Currency",
      key:'currencyCode',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Payment reference",
      key:'bankRefNo',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Sender Acc No./IBan",
      key:'debtorAccountNumber',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Sender name",
      key:'debtorName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created date",
      key:'createdDate',
      search:true,
      dataType:"date",
      value:'',
      class:'form-control'
    },
    {
      name:"Cleared date",
      key:'transactionDate',
      search:true,
      dataType:"date",
      value:'',
      class:'form-control'
    },
    {
      name:"Cleared by",
      key:'clearedByName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Sender type",
      key:'senderType',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Status",
      key:'complianceStatus',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Is Locked",
      key:'locked',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Blacklist",
      key:'blackListCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Third party",
      key:'thirdParty',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Sanction",
      key:'sanctionCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Others",
      key:'cifasCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
  ]
  filteredData:any
  constructor(private service: AdminService,
              public router: Router,
              private downloadService: DownloadService,
              private datepipe: DatePipe,
              private localStorage :LocalStorageService) {
    const queueDataa: any = this.localStorage.getItem('filteredData')
    this.filteredData = JSON.parse(queueDataa)

    this.ComplianceFilteredData.status=this.filteredData?.status || null
    this.ComplianceFilteredData.isLocked=this.filteredData?.isLocked || null
    this.ComplianceFilteredData.senderType=this.filteredData?.senderType || null
    this.ComplianceFilteredData.lockedBy=this.filteredData?.lockedBy || null
    this.ComplianceFilteredData.createdDate=this.filteredData?.createdDate || null
    this.ComplianceFilteredData.allocatedCustomerId=this.filteredData?.allocatedCustomerId || null
    this.ComplianceFilteredData.customerName=this.filteredData?.customerName || null
    this.ComplianceFilteredData.amount=this.filteredData?.amount || null
    this.ComplianceFilteredData.bank=this.filteredData?.bank || null
    this.ComplianceFilteredData.currencyCode=this.filteredData?.currencyCode || null
    this.ComplianceFilteredData.allocatedDealId=this.filteredData?.allocatedDealId || null
    this.ComplianceFilteredData.bankRefNo=this.filteredData?.bankRefNo || null
    this.ComplianceFilteredData.debtorAccountNumber=this.filteredData?.debtorAccountNumber || null
    this.ComplianceFilteredData.debtorName=this.filteredData?.debtorName || null
    this.ComplianceFilteredData.transactionDate=this.filteredData?.transactionDate || null
    this.ComplianceFilteredData.clearedByName=this.filteredData?.clearedByName || null
    this.ComplianceFilteredData.blacklistCheck=this.filteredData?.blacklistCheck || null
    this.ComplianceFilteredData.thirdPartyCheck=this.filteredData?.thirdPartyCheck || null
    this.ComplianceFilteredData.sanctionCheck=this.filteredData?.sanctionCheck || null
    this.ComplianceFilteredData.cifasCheck=this.filteredData?.cifasCheck || null

    this.ComplianceStatus = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('PayinComplianceStatus')})
      })
    });
    this.senderTypeForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN', [Validators.required]),
        body: new FormGroup({
          sysLookupName: new FormControl('SenderType', [Validators.required])
        })
      })
    });
    this.IsLocked = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('IsLocked')})
      })
    });
    this.ServiceCheck = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('ServiceStatus')})
      })
    });

    this.payInForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('PAYMENT_IN_LIST', [Validators.required]),
        body: new FormGroup({
          pageNumber: new FormControl(0),
          numberOfElements: new FormControl(20),
          amount: new FormControl(this.filteredData?this.filteredData.amount:null),
          debtorName: new FormControl(this.filteredData?this.filteredData.debtorName:null),
          customerName: new FormControl(this.filteredData?this.filteredData.customerName:null),
          currencyCode: new FormControl(this.filteredData?this.filteredData.currencyCode:null),
          allocatedCustomerId: new FormControl(this.filteredData?this.filteredData.allocatedCustomerId:null),
          allocatedDealId: new FormControl(this.filteredData?this.filteredData.allocatedDealId:null),
          debtorAccountNumber: new FormControl(this.filteredData?this.filteredData.debtorAccountNumber:null),
          iban: new FormControl(this.filteredData?this.filteredData.iban:null),
          lockedBy: new FormControl(this.filteredData?(this.filteredData.lockedBy?this.localStorage.getItem("userId"):null):null),
          complianceStatus: new FormControl(this.filteredData?this.filteredData.status:null),
          locked: new FormControl(this.filteredData?(this.filteredData.isLocked!=null?this.filteredData.isLocked==='LOCK':null):null),
          sanctionCheck: new FormControl(this.filteredData?this.filteredData.sanctionCheck:null),
          blacklistCheck: new FormControl(this.filteredData?this.filteredData.blacklistCheck:null),
          customCheck: new FormControl(this.filteredData?this.filteredData.customCheck:null),
          cifasCheck: new FormControl(this.filteredData?this.filteredData.cifasCheck:null),
          // whitelistCheck: new FormControl(null),
          bankSanctionCheck: new FormControl(this.filteredData?this.filteredData.bankSanctionCheck:null),
          thirdPartyCheck: new FormControl(this.filteredData?this.filteredData.thirdPartyCheck:null),
          senderType: new FormControl(this.filteredData?this.filteredData.senderType:null),
          bank: new FormControl(this.filteredData?this.filteredData.bank:null),
          bankRefNo: new FormControl(this.filteredData?this.filteredData.bankRefNo:null),
          clearedByName: new FormControl(this.filteredData?this.filteredData.clearedByName:null),
          fromClearedDate: new FormControl(this.filteredData?.transactionDate ? moment(this.filteredData.transactionDate[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null),
          toClearedDate: new FormControl(this.filteredData?.transactionDate ? moment(this.filteredData.transactionDate[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null),
          fromCreatedOn: new FormControl(this.filteredData?.createdDate ? moment(this.filteredData.createdDate[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null),
          toCreatedOn: new FormControl(this.filteredData?.createdDate ? moment(this.filteredData.createdDate[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null)
        })
      })
    });
    // console.log(this.payInForm.controls['request']['controls']['body'].value)

    this.lockForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('PAYMENT_IN_LOCK', [Validators.required]),
        body: new FormGroup({
          updatedBy: new FormControl(this.localStorage.getItem("userId")),
          cpilRequest: new FormArray(
            [])
        })
      })
    })
  }

  XLS() {
    this.payInForm.controls['request'].value.body.numberOfElements = this.TotalElements
    this.service.payInList(this.payInForm.value).subscribe(data => {
      this.downloadService.exportAsExcelFile(data.content, "PAYIN-" + this.currentDate)
    })
  }

  CSV() {
    this.payInForm.controls['request'].value.body.numberOfElements = this.TotalElements
    this.service.payInList(this.payInForm.value).subscribe((data: any) => {
      this.downloadService.exportAsCsvFile(data.content, "PAYIN-" + this.currentDate)
    })
  }

  ngOnInit() {
    this.checkedAll = false
    this.lockForm.value.request.body.cpilRequest.length = 0
    this.paymentInList()
    this.service.payInList(this.ComplianceStatus.value).subscribe(data => {
      this.complianceStatus = data
      this.tabColumns.forEach(column => {
      if(column.key==='complianceStatus'){
        column.value = data;
      }})
    })
    this.service.payInList(this.IsLocked.value).subscribe(data => {
      this.Locking = data
      this.tabColumns.forEach(column => {
        if (column.key === 'locked') {
          column.value = data;
        }
      });
    })
    this.service.payInList(this.ServiceCheck.value).subscribe(data => {
      this.blackListCheck = data
      this.tabColumns.forEach(column => {
        if (column.key === 'blackListCheck' || column.key==='cifasCheck' || column.key ==='sanctionCheck' || column.key==='thirdParty') {
          column.value = data;
        }
      });
    })
    this.service.payInList(this.senderTypeForm.value).subscribe((data: any) => {
      this.senderType = data
      this.tabColumns.forEach(column => {
        if (column.key === 'senderType') {
          column.value = data;
        }
      });
    })
  }
  paymentInList() {
    this.localStorage.setItem("filteredData",JSON.stringify(this.ComplianceFilteredData))
    this.createdDateRange=this.ComplianceFilteredData.createdDate?[new Date(this.ComplianceFilteredData?.createdDate[0]),new Date(this.ComplianceFilteredData?.createdDate[1])]:null
    this.transactionDateRange=this.ComplianceFilteredData.transactionDate?[new Date(this.ComplianceFilteredData?.transactionDate[0]),new Date(this.ComplianceFilteredData?.transactionDate[1])]:null
    this.service.payInList(this.payInForm.value).subscribe((data) => {
      this.payIn = data.content
      this.TotalElements = data.totalElements
      for (let i = 0; i < this.payIn.length; i++) {
        this.selected[i] = false;
      }
    }, error => {
      console.log(error)
    })
  }

  handlePageEvent(e: PageEvent) {
    this.payInForm.controls['request'].value.body.pageNumber = e.pageIndex
    this.PageNumber = e.pageIndex
    this.payInForm.controls['request'].value.body.numberOfElements = e.pageSize
    this.NumberOfElement = e.pageSize
    this.paymentInList()
  }

  lock() {
    for (let i = 0; i < this.payIn.length; i++) {
      if (this.selected[i]) {
        this.lockForm.value.request.body.cpilRequest.push({paymentInId: this.payIn[i].id, lock: this.selected[i]})
        this.lockedData.push(this.payIn[i].id)
      }
    }
    this.service.menuPanel(this.lockForm.value).subscribe((data) => {
      this.ngOnInit()
    }, error1 => {
      console.log(error1)
    })
  }

  unlock() {
    for (let i = 0; i < this.payIn.length; i++) {
      if (!this.selected[i]) {
        this.lockForm.value.request.body.cpilRequest.push({paymentInId: this.payIn[i].id, lock: this.selected[i]})
        this.lockedData.push(this.payIn[i].id)
      }
    }
    this.service.menuPanel(this.lockForm.value).subscribe((data) => {
      this.ngOnInit()
    }, error => {
      this.ngOnInit()
    })
  }

  selectAll(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.payIn.length; i++) {
        this.selected[i] = true;
      }
    } else {
      for (let i = 0; i < this.payIn.length; i++) {
        this.selected[i] = false;
      }
    }
  }

  searchEmited(event:any){
    this.searching(event.value,event.key)
  }
  searching(event: any, keyWord: any) {
    switch (keyWord) {
      case 'currencyCode':
        this.payInForm.patchValue({request: {body: {currencyCode: event}}})
        this.ComplianceFilteredData.currencyCode=event === '' ? null : event
        break;
      case 'amount':
        this.payInForm.patchValue({request: {body: {amount: event}}})
        this.ComplianceFilteredData.amount=event === '' ? null : event
        break
      case 'allocatedCustomerId':
        this.payInForm.patchValue({request: {body: {allocatedCustomerId: event}}})
        this.ComplianceFilteredData.allocatedCustomerId=event === '' ? null : event
        break
      case 'complianceStatus':
        this.payInForm.patchValue({request: {body: {complianceStatus: event === 'null' ? null : event}}})
        this.ComplianceFilteredData.status=event === 'null' ? null : event
        break
      case 'senderType':
        this.payInForm.patchValue({request: {body: {senderType: event === 'null' ? null : event}}})
        this.ComplianceFilteredData.senderType=event === 'null' ? null : event
        break
      case 'allocatedDealId':
        this.payInForm.patchValue({request: {body: {allocatedDealId: event}}})
        this.ComplianceFilteredData.allocatedDealId=event === '' ? null : event
        break
      case 'bankRefNo':
        this.payInForm.patchValue({request: {body: {bankRefNo: event === '' ? null : event}}})
        this.ComplianceFilteredData.bankRefNo=event === '' ? null : event
        break
      case 'debtorName':
        this.payInForm.patchValue({request: {body: {debtorName: event === '' ? null : event}}})
        this.ComplianceFilteredData.debtorName=event === '' ? null : event
        break
      case 'customerName':
        this.payInForm.patchValue({request: {body: {customerName: event === '' ? null : event}}})
        this.ComplianceFilteredData.customerName=event === '' ? null : event
        break
      case 'bank':
        this.payInForm.patchValue({request: {body: {bank: event === '' ? null : event}}})
        this.ComplianceFilteredData.bank=event === '' ? null : event
        break
      case 'debtorAccountNumber':
        this.payInForm.patchValue({request: {body: {debtorAccountNumber: event === '' ? null : event}}})
        this.ComplianceFilteredData.debtorAccountNumber=event === '' ? null : event
        break
      case 'blackListCheck':
        this.payInForm.patchValue({request: {body: {blacklistCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.blacklistCheck=event === '0' ? null : event
        break
      case 'thirdParty':
        this.payInForm.patchValue({request: {body: {thirdPartyCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.thirdPartyCheck=event === '0' ? null : event
        break
      case 'sanctionCheck':
        this.payInForm.patchValue({request: {body: {sanctionCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.sanctionCheck=event === '0' ? null : event
        break
      case 'customCheck':
        this.payInForm.patchValue({request: {body: {customCheck: event === '0' ? null : event}}})
        break
      case 'whitelistCheck':
        this.payInForm.patchValue({request: {body: {whitelistCheck: event === '0' ? null : event}}})
        break
      case 'cifasCheck':
        this.payInForm.patchValue({request: {body: {cifasCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.cifasCheck=event === '0' ? null : event
        break
      case 'lockedBy':
        this.payInForm.patchValue({request: {body: {lockedBy: event.checked ? this.localStorage.getItem("userId") : null}}})
        this.ComplianceFilteredData.lockedBy=event.checked
        break
      case 'locked':
        this.payInForm.patchValue({request: {body: {locked: event === 'null' ? null : (event === 'LOCK')}}})
        this.ComplianceFilteredData.isLocked=event === 'null' ? null : event
        break
      case 'clearedByName':
        this.payInForm.patchValue({request: {body: {clearedByName: event === '' ? null : event}}})
        this.ComplianceFilteredData.clearedByName=event === '' ? null : event
        break
      case 'transactionDate':
        this.payInForm.patchValue({request: {body: {
              fromClearedDate: event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
              toClearedDate: event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
            }}})
        this.ComplianceFilteredData.transactionDate=event
        break
      case 'createdDate':
        this.payInForm.patchValue({request: {body: {
              fromCreatedOn: event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
              toCreatedOn: event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
            }}})
        this.ComplianceFilteredData.createdDate=event
        break
    }
    this.paymentInList()
    this.paginator?.firstPage()
  }

  clearFilter() {
    this.ComplianceFilteredData={
      senderType:null, status:null, isLocked:null, lockedBy:this.filteredData?.lockedBy,
      createdDate:null, allocatedCustomerId:null, customerName:null, amount:null, bank:null,
      currencyCode:null, allocatedDealId:null, bankRefNo:null, debtorAccountNumber:null,
      debtorName:null, transactionDate:null, clearedByName:null, blacklistCheck:null,
      thirdPartyCheck:null, sanctionCheck:null, cifasCheck:null
    }
    this.transactionDateRange = null
    this.createdDateRange = null
    this.payInForm.patchValue({
      request: {
        body: {
          amount: null, debtorName: null,
          customerName: null, currencyCode: null, allocatedCustomerId: null, allocatedDealId: null,
          debtorAccountNumber: null, iban: null, complianceStatus: null, locked: null, sanctionCheck: null,
          velocityCheck: null, customCheck: null, bankSanctionCheck: null, cifasCheck: null,
          thirdPartyCheck: null, blacklistCheck: null, senderType: null, bank: null, bankRefNo: null,
          clearedByName: null,fromClearedDate:null,toClearedDate:null,fromCreatedOn:null,toCreatedOn:null
        }
      }
    })
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    this.ngOnInit()
  }

  display() {
    this.displayed = !this.displayed
  }

  onRoute(index: any) {
    this.routeData = {
      id: this.payIn[index].id,
      lock: this.payIn[index].locked,
      lockedBy: this.payIn[index].lockedBy,
      lockedByName: this.payIn[index].lockedName,
      clientId: this.payIn[index].allocatedCustomerId,
      moduleId: this.payIn[index].moduleId,
      status: this.payIn[index].complianceStatus
    }
    this.localStorage.setItem("queueData", JSON.stringify(this.routeData))
    this.router.navigate(['/Payin_Service'])
  }
   openNav() {
     const sidebar = document.getElementById("mySidebar");
     sidebar?.style.setProperty("width", "220px")
     const main = document.getElementById("main");
     main?.style.setProperty("marginLeft", "220px")
  }

   closeNav() {
     const sidebar = document.getElementById("mySidebar");
     sidebar?.style.setProperty("width", "0")
     const main = document.getElementById("main");
     main?.style.setProperty("marginLeft", "0")
  }
  opened:boolean=false
  onClick(){
    this.opened=!this.opened;
    const  sidebar = document.getElementById('sidebar')
    sidebar?.style.setProperty("width",this.opened?"237px":"0");
  }
}
