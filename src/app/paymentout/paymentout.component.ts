import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import moment from 'moment';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { FiltersidebarComponent } from '../filtersidebar/filtersidebar.component';

@Component({
  selector: 'app-paymentout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FiltersidebarComponent,FormsModule],
  templateUrl: './paymentout.component.html',
  styleUrl: './paymentout.component.css',
  providers: [DatePipe],
})
export class PaymentoutComponent {
  @Input() toggleButton:boolean=false
  @ViewChild('paginator') paginator: MatPaginator
  payoutDetails: FormGroup;
  maxDate = new Date();
  payoutDetailsResponse: any;
  totalElements: any;
  complianceStatus: FormGroup;
  serviceCheck: FormGroup;
  isLocked: FormGroup;
  isLockedResponse: any;
  serviceCheckResponse: any;
  complianceStatusResponse: any;
  currentDate = this.datepipe.transform((new Date), 'MM/dd/yyyy');
  loginData: any;
  PageNumber: number = 0;
  TotalElements: any;
  NumberOfElement: number = 20;
  transactionDateRange : any;
  clearedDateRange : any;
  valueDateRange : any;
  ComplianceFilteredData = {
    payoutId : null,
    dealId : null,
    clientId: null,
    beneName : null,
    amount : null,
    currencyCode : null,
    countryCode : null,
    blacklist : null,
    customerSanctionCheck: null,
    beneSanctionCheck : null,
    beneCifasCheck : null,
    custom : null,
    status: null,
    isLocked: null,
    lockedBy: null,
    transactionDateRange: null,
    valueDateRange: null,
    clearedDateRange:null,
    customerCifasCheck: null,
    clearedByName: null,
    customCheck: null,
    recipientAccountNumber: null,
    recipientBicCode: null
  }
  tabColumns=[
    {
      name:"Payout Id",
      key:'paymentOutId',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Beneficiary Name",
      key:'beneName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Beneficiary Acc. No.",
      key:'recipientAccountNumber',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Beneficiary Bic/Swift",
      key:'recipientBicCode',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Amount",
      key:'amount',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Currency Code",
      key:'currencyCode',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Country Code",
      key:'countryCode',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Value Date",
      key:'valueDate',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created Date",
      key:'createdDate',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Cleared Date",
      key:'clearedDate',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Cleared By",
      key:'clearedByName',
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
      key:'blacklistCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Beneficiary Sanction",
      key:'beneSanctionCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Customer Sanction",
      key:'customerSanctionCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Beneficiary Others",
      key:'beneCifasCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Customer Others",
      key:'customerCifasCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Custom",
      key:'customCheck',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    }
  ]
  filteredData: any
  createdDateRange: any
  constructor(private service: AdminService,
              public router: Router,
              private downloadService: DownloadService,
              private localStorage :LocalStorageService,
              private datepipe: DatePipe) {

    const loginData: any = this.localStorage.getItem("data")
    this.loginData = JSON.parse(loginData)

    const queueDataa: any = this.localStorage.getItem('payoutFilterData')
    this.filteredData = JSON.parse(queueDataa)
    this.ComplianceFilteredData.status=this.filteredData?.status || null
    this.ComplianceFilteredData.customerSanctionCheck=this.filteredData?.customerSanctionCheck || null
    this.ComplianceFilteredData.isLocked=this.filteredData?.isLocked || null
    this.ComplianceFilteredData.payoutId=this.filteredData?.payoutId || null
    this.ComplianceFilteredData.dealId=this.filteredData?.dealId || null
    this.ComplianceFilteredData.clientId=this.filteredData?.clientId || null
    this.ComplianceFilteredData.blacklist=this.filteredData?.blacklist || null
    this.ComplianceFilteredData.beneSanctionCheck=this.filteredData?.beneSanctionCheck || null
    this.ComplianceFilteredData.beneCifasCheck=this.filteredData?.beneCifasCheck || null
    this.ComplianceFilteredData.custom=this.filteredData?.custom || null
    this.ComplianceFilteredData.countryCode=this.filteredData?.countryCode || null
    this.ComplianceFilteredData.currencyCode=this.filteredData?.currencyCode || null
    this.ComplianceFilteredData.lockedBy=this.filteredData?.lockedBy || null
    this.ComplianceFilteredData.transactionDateRange=this.filteredData?.transactionDateRange || null
    this.ComplianceFilteredData.clearedDateRange=this.filteredData?.clearedDateRange || null
    this.ComplianceFilteredData.beneName=this.filteredData?.beneName || null
    this.ComplianceFilteredData.amount=this.filteredData?.amount || null
    this.ComplianceFilteredData.customerCifasCheck=this.filteredData?.customerCifasCheck || null
    this.ComplianceFilteredData.customCheck=this.filteredData?.customCheck || null
    this.ComplianceFilteredData.clearedByName=this.filteredData?.clearedByName || null
    this.ComplianceFilteredData.valueDateRange=this.filteredData?.valueDateRange || null
    this.ComplianceFilteredData.recipientAccountNumber=this.filteredData?.recipientAccountNumber || null
    this.ComplianceFilteredData.recipientBicCode=this.filteredData?.recipientBicCode || null

    this.payoutDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMP_PAYOUT_DETAILS_LIST'),
        body: new FormGroup({
          pageNumber: new FormControl(0),
          numberOfElements: new FormControl(20),
          amount: new FormControl(this.filteredData?this.filteredData.amount:null),
          paymentOutId: new FormControl(this.filteredData?this.filteredData.payoutId:null),
          dealId: new FormControl(this.filteredData?this.filteredData.dealId:null),
          companyName: new FormControl(this.filteredData?this.filteredData.company:null),
          beneName: new FormControl(this.filteredData?this.filteredData.beneName:null),
          currencyCode: new FormControl(this.filteredData?this.filteredData.currencyCode:null),
          customCheck: new FormControl(this.filteredData?this.filteredData.customCheck:null),
          customerCifasCheck: new FormControl(this.filteredData?this.filteredData.customerCifasCheck:null),
          payoutClientId: new FormControl(this.filteredData?this.filteredData.clientId:null),
          beneCountry: new FormControl(this.filteredData?this.filteredData.countryCode:null),
          recipientBicCode: new FormControl(this.filteredData?this.filteredData.recipientBicCode:null),
          recipientAccountNumber: new FormControl(this.filteredData?this.filteredData.recipientAccountNumber:null),
          clearedByName: new FormControl(this.filteredData?this.filteredData.clearedByName:null),
          complianceStatus: new FormControl(this.filteredData?this.filteredData.status:null),
          blacklistCheck: new FormControl(this.filteredData?this.filteredData.blacklist:null),
          customerSanctionCheck: new FormControl(this.filteredData?this.filteredData.customerSanctionCheck:null),
          beneSanctionCheck: new FormControl(this.filteredData?this.filteredData.beneSanctionCheck:null),
          customerSanction: new FormControl(this.filteredData?this.filteredData.custom:null),
          beneCifasCheck: new FormControl(this.filteredData?this.filteredData.beneCifasCheck:null),
          sanctionCheck: new FormControl(this.filteredData?this.filteredData.sanction:null),
          lockedBy: new FormControl(this.filteredData?(this.filteredData.lockedBy?this.localStorage.getItem("userId"):null):null),
          locked:new FormControl(this.filteredData?(this.filteredData.isLocked!=null?this.filteredData.isLocked==='LOCK':null):null),
          fromCreatedOn: new FormControl(this.filteredData?.transactionDateRange ? moment(this.filteredData.transactionDateRange[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null),
          toCreatedOn: new FormControl(this.filteredData?.transactionDateRange ? moment(this.filteredData.transactionDateRange[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null),
          fromClearedDate: new FormControl(this.filteredData?.clearedDateRange ? moment(this.filteredData.clearedDateRange[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null),
          toClearedDate: new FormControl(this.filteredData?.clearedDateRange ? moment(this.filteredData.clearedDateRange[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null),
          fromValueDate: new FormControl(this.filteredData?.valueDateRange ? moment(this.filteredData.valueDateRange[0]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null),
          toValueDate: new FormControl(this.filteredData?.valueDateRange ? moment(this.filteredData.valueDateRange[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null)
        })
      })
    });

    this.complianceStatus = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('PayoutComplianceStatus')})
      })
    });

    this.serviceCheck = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('ServiceStatus')})
      })
    });

    this.isLocked = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('IsLocked')})
      })
    });
  }

  payoutList() {
    this.localStorage.setItem("payoutFilterData",JSON.stringify(this.ComplianceFilteredData))
    this.transactionDateRange=this.ComplianceFilteredData.transactionDateRange?[new Date(this.ComplianceFilteredData?.transactionDateRange[0]),new Date(this.ComplianceFilteredData?.transactionDateRange[1])]:null
    this.clearedDateRange=this.ComplianceFilteredData.clearedDateRange?[new Date(this.ComplianceFilteredData?.clearedDateRange[0]),new Date(this.ComplianceFilteredData?.clearedDateRange[1])]:null
    this.valueDateRange=this.ComplianceFilteredData.valueDateRange?[new Date(this.ComplianceFilteredData?.valueDateRange[0]),new Date(this.ComplianceFilteredData?.valueDateRange[1])]:null
    this.service.payInList(this.payoutDetails.value).subscribe((response) => {
      this.payoutDetailsResponse = response.content;
      this.TotalElements = response.totalElements
      this.PageNumber = response.number
      this.totalElements = response.totalElements
    }, error => {
      console.log(error)
    })

  }

  ngOnInit() {
    this.payoutList();
    this.service.payInList(this.complianceStatus.value).subscribe((response) => {
      this.complianceStatusResponse = response;
    }, error => {
      console.log(error)
    })

    this.service.payInList(this.isLocked.value).subscribe((response) => {
      this.isLockedResponse = response;
    }, error => {
      console.log(error)
    })

    this.service.payInList(this.serviceCheck.value).subscribe((response) => {
      this.serviceCheckResponse = response;
    }, error => {
      console.log(error)
    })
  }
  onRoute(i) {
    const routeData = {
      id: this.payoutDetailsResponse[i].id,
      cNo: this.payoutDetailsResponse[i].clientId,
      locked: this.payoutDetailsResponse[i].locked,
      lockedBy: this.payoutDetailsResponse[i].lockedBy,
      lockedByName: this.payoutDetailsResponse[i].lockedByName,
      moduleId: this.payoutDetailsResponse[i].moduleId,
      status: this.payoutDetailsResponse[i].complianceStatus
    }
    this.localStorage.setItem("payoutData", JSON.stringify(routeData))
    this.router.navigate(['/payout-dash'])
  }

  handlePageEvent(e: PageEvent) {
    this.payoutDetails.controls['request'].value.body.pageNumber = e.pageIndex
    this.PageNumber = e.pageIndex
    this.payoutDetails.controls['request'].value.body.numberOfElements = e.pageSize
    this.NumberOfElement = e.pageSize
    this.payoutList();
  }

  payout(data: any) {
    if (data.target.value.length === 0) {
      this.payoutDetails.controls['request'].value.body.paymentOutId = null;
      this.payoutList();
    } else {
      this.payoutDetails.controls['request'].value.body.paymentOutId = data.target.value.trim();
      this.payoutList();
    }
  }
  csv() {
    this.payoutDetails.controls['request'].value.body.numberOfElements = this.TotalElements
    this.service.payInList(this.payoutDetails.value).subscribe((data: any) => {
      this.downloadService.exportAsCsvFile(data.content, "PayOutQueue-" + this.currentDate)
    })
  }

  xls() {
    this.payoutDetails.controls['request'].value.body.numberOfElements = this.TotalElements
    this.service.payInList(this.payoutDetails.value).subscribe(data => {
      this.downloadService.exportAsExcelFile(data.content, "PayOutQueue-" + this.currentDate)
    })
  }
  searchEmited(event:any){
    this.searching(event.value,event.key)
  }
  clearSearch() {
    this.ComplianceFilteredData = {
      payoutId : null,
      clientId: null,
      dealId: null,
      beneName : null,
      amount : null,
      currencyCode : null,
      countryCode : null,
      blacklist : null,
      customerSanctionCheck: null,
      beneSanctionCheck : null,
      beneCifasCheck : null,
      custom : null,
      status: null,
      clearedByName: null,
      isLocked: null,
      lockedBy: this.ComplianceFilteredData.lockedBy,
      transactionDateRange: null,
      valueDateRange: null,
      clearedDateRange: null,
      customerCifasCheck: null,
      customCheck: null,
      recipientAccountNumber: null,
      recipientBicCode: null
    }
    this.transactionDateRange = null
    this.clearedDateRange = null
    this.createdDateRange = null
    this.valueDateRange = null
    this.payoutDetails.patchValue({
      request: {
        body: {
          beneCifasCheck: null, velocityCheck: null,clearedByName:null,
          customCheck: null, blacklistCheck: null, sanctionCheck: null, locked: null,
          complianceStatus: null, beneCountry: null, currencyCode: null, beneName: null, dealId: null,
          customerNo: null, amount: null, beneType: null, companyName: null, beneSanctionCheck : null, customerSanctionCheck : null,
          fromCreatedOn: null, toCreatedOn: null , paymentOutId: null , payoutClientId: null ,countryCode: null,customerCifasCheck:null,
          fromClearedDate:null,toClearedDate:null,fromValueDate:null,toValueDate:null,recipientBicCode:null,recipientAccountNumber:null
        }
      }
    })
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    this.ngOnInit();
  }
    searching(event: any, keyWord: any) {
    switch (keyWord) {
      case 'paymentOutId':
        this.payoutDetails.patchValue({request: {body: {paymentOutId: event}}})
        this.ComplianceFilteredData.payoutId=event === 0 ? null : event
        break;
      case 'payoutClientId':
        this.payoutDetails.patchValue({request: {body: {payoutClientId: event}}})
        this.ComplianceFilteredData.clientId=event === 0 ? null : event
        break;
      case 'beneName':
        this.payoutDetails.patchValue({request: {body: {beneName: event}}})
        this.ComplianceFilteredData.beneName=event === 0 ? null : event
        break;
      case 'recipientAccountNumber':
        this.payoutDetails.patchValue({request: {body: {recipientAccountNumber: event}}})
        this.ComplianceFilteredData.recipientAccountNumber=event === 0 ? null : event
        break;
      case 'recipientBicCode':
        this.payoutDetails.patchValue({request: {body: {recipientBicCode: event}}})
        this.ComplianceFilteredData.recipientBicCode=event === 0 ? null : event
        break;
      case 'amount':
        this.payoutDetails.patchValue({request: {body: {amount: event}}})
        this.ComplianceFilteredData.amount=event === 0 ? null : event
        break;
      case 'currencyCode':
        this.payoutDetails.patchValue({request: {body: {currencyCode: event}}})
        this.ComplianceFilteredData.currencyCode=event === 0 ? null : event
        break;
      case 'beneCountry':
        this.payoutDetails.patchValue({request: {body: {beneCountry: event}}})
        this.ComplianceFilteredData.countryCode=event === 0 ? null : event
        break;
      case 'complianceStatus':
        this.payoutDetails.patchValue({request: {body: {complianceStatus: event === '0' ? null : event}}})
        this.ComplianceFilteredData.status = event === 'null' ? null : event
        break
      case 'locked':
        this.payoutDetails.patchValue({request: {body: {locked: event === 'null' ? null : (event === 'LOCK')}}})
        this.ComplianceFilteredData.isLocked=event === 'null' ? null : event
        break
      case 'lockedBy':
        this.payoutDetails.patchValue({request: {body: {lockedBy: event.checked ? this.localStorage.getItem("userId") : null}}})
        this.ComplianceFilteredData.lockedBy=event.checked
        break
      case 'blacklistCheck':
        this.payoutDetails.patchValue({request: {body: {blacklistCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.blacklist=event === 'null' ? null : event
        break
      case 'beneSanctionCheck':
        this.payoutDetails.patchValue({request: {body: {beneSanctionCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.beneSanctionCheck=event === 'null' ? null : event
        break
      case 'customerSanctionCheck':
        this.payoutDetails.patchValue({request: {body: {customerSanctionCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.customerSanctionCheck=event === 'null' ? null : event
        break
      case 'beneCifasCheck':
        this.payoutDetails.patchValue({request: {body: {beneCifasCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.beneCifasCheck=event === 'null' ? null : event
        break
      case 'customerCifasCheck':
        this.payoutDetails.patchValue({request: {body: {customerCifasCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.customerCifasCheck=event === 'null' ? null : event
        break
      case 'customCheck':
        this.payoutDetails.patchValue({request: {body: {customCheck: event === '0' ? null : event}}})
        this.ComplianceFilteredData.customCheck=event === 'null' ? null : event
        break
      case 'clearedByName':
        this.payoutDetails.patchValue({request: {body: {clearedByName: event === '0' ? null : event}}})
        this.ComplianceFilteredData.clearedByName=event === 'null' ? null : event
        break
      case 'dealId':
        this.payoutDetails.patchValue({request: {body: {dealId: event === '0' ? null : event}}})
        this.ComplianceFilteredData.dealId=event === 'null' ? null : event
        break
      case 'createdDate':
        this.payoutDetails.patchValue({
          request: {
            body: {
              fromCreatedOn: event ? moment(event[0]).format('YYYY-MM-DD' + 'T00:00:00' + '.000Z') : null,
              toCreatedOn: event ? moment(event[1]).format('YYYY-MM-DD' + 'T23:59:59' + '.000Z') : null
            }
          }
        })
        this.ComplianceFilteredData.transactionDateRange=event;
        break
      case 'valueDate':
        this.payoutDetails.patchValue({
          request: {
            body: {
              fromValueDate: event ? moment(event[0]).format('YYYY-MM-DD' + 'T00:00:00' + '.000Z') : null,
              toValueDate: event ? moment(event[1]).format('YYYY-MM-DD' + 'T23:59:59' + '.000Z') : null
            }
          }
        })
        this.ComplianceFilteredData.valueDateRange=event;
        break
      case 'clearedDate':
        this.payoutDetails.patchValue({
          request: {
            body: {
              fromClearedDateOn: event ? moment(event[0]).format('YYYY-MM-DD' + 'T00:00:00' + '.000Z') : null,
              toClearedDate: event ? moment(event[1]).format('YYYY-MM-DD' + 'T23:59:59' + '.000Z') : null
            }
          }
        })
        this.ComplianceFilteredData.clearedDateRange=event;
        break
    }
    this.payoutList()
    this.paginator?.firstPage()
  }
  opened:boolean=false
  onClick(){
    // document.body.classList.toggle('sidebar-icon-only');
    this.opened=!this.opened;
    const  sidebar = document.getElementById('sidebar')
    sidebar?.style.setProperty("width",this.opened?"237px":"0");
  }
}
