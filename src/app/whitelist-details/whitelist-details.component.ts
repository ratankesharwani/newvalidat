import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import dayjs from 'dayjs';
import moment from 'moment';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-whitelist-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink,MatTooltip],
  templateUrl: './whitelist-details.component.html',
  styleUrl: './whitelist-details.component.css'
})
export class WhitelistDetailsComponent {
  @ViewChild('paginator') paginator: MatPaginator
  whitelistForm:FormGroup;
  whitelistStatusUpdate : FormGroup;
  senderTypeForm:FormGroup;
  whitelist:any
  PageNumber:any;
  TotalElements:any
  NumberOfElement:number=20
  page: any
  whiteListStatus =[{display:'Active',value:true},{display: 'Inactive',value: false}]
  openPop:boolean=false
  AlertMessage=''
  queueParseData: any;
  statusSearch=null
  maxDate = new Date()
  createdDateRange
  updatedDateRange
  senderType:any

  tabColumns=[
    {
      name:"Client Number",
      key:'emailId',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Description",
      key:'department',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created By",
      key:'mobileNo',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created On",
      key:'firstName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated By",
      key:'middleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated On",
      key:'lastName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Account No.",
      key:'jobTitle',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Debtor Name",
      key:'status',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Debtor Country",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Bank Name",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Currency Code",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Sender Type",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Action",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
  ]

  constructor(private service: AdminService,
              private downloadService:DownloadService,
              public dialog: MatDialog,
            private localStorage:LocalStorageService) {
    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)

    this.whitelistForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('WHITELIST_DETAILS_GET', [Validators.required]),
        body: new FormGroup({
          pageNumber:new FormControl(0),
          numberOfElements:new FormControl(60),
          clientId:new FormControl(),
          description:new FormControl(),
          createdBy:new FormControl(),
          createdOn:new FormControl(),
          updatedBy:new FormControl(),
          updatedOn:new FormControl(),
          status:new FormControl(),
          accountNumber:new FormControl(),
          debtorName:new FormControl(),
          debtorCountry:new FormControl(),
          bankName:new FormControl(),
          currencyCode:new FormControl(),
          creatorFirstName:new FormControl(),
          senderType:new FormControl()
        })
      })
    });


    this.whitelistStatusUpdate = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('WHITELIST_DETAILS_UPDATE', [Validators.required]),
        body: new FormGroup({
          id: new FormControl(),
          status: new FormControl(),
          updatedBy: new FormControl()
        })
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
    this.senderTypeDropdown()
  }
  CSV(){
    this.whitelistForm.controls['request'].value.body.numberOfElements=this.TotalElements
    this.service.payInList(this.whitelistForm.value).subscribe((data:any)=>{
      this.downloadService.exportAsCsvFile(data.content,"Whitelist")
    })
  }
  XLS(){
    this.whitelistForm.controls['request'].value.body.numberOfElements=this.TotalElements
    this.service.payInList(this.whitelistForm.value).subscribe((data:any)=>{
      this.downloadService.exportAsExcelFile(data.content,"Whitelist")
    })
  }
  ngOnInit(){
    this.whitelistForm.controls['request'].value.body.pageNumber=this.PageNumber
    this.whitelistForm.controls['request'].value.body.numberOfElements=this.NumberOfElement
    this.service.payInList(this.whitelistForm.value).subscribe((data)=>{
      this.whitelist=data.content;
      this.TotalElements=data.totalElements
    })
  }
  senderTypeDropdown() {
    this.service.payInList(this.senderTypeForm.value).subscribe((data: any) => {
      this.senderType = data
    })
  }
  clearFilter(){
    this.createdDateRange = null
    this.updatedDateRange = null
    this.whitelistForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('WHITELIST_DETAILS_GET', [Validators.required]),
        body: new FormGroup({
          pageNumber:new FormControl(0),
          numberOfElements:new FormControl(60),
          clientId:new FormControl(),
          description:new FormControl(),
          createdBy:new FormControl(),
          createdOn:new FormControl(),
          updatedBy:new FormControl(),
          updatedOn:new FormControl(),
          status:new FormControl(),
          accountNumber:new FormControl(),
          debtorName:new FormControl(),
          debtorCountry:new FormControl(),
          bankName:new FormControl(),
          currencyCode:new FormControl(),
          createdByName:new FormControl(),
          updatedByName: new FormControl(),
          senderType: new FormControl(),
        })
      })
    });
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    this.statusSearch = null
    this.ngOnInit()
    this.senderTypeDropdown()
  }
  handlePageEvent(e: PageEvent) {
    this.PageNumber = e.pageIndex
    this.NumberOfElement = e.pageSize
    this.ngOnInit()
  }

  onSearchClientNo(event: any) {
    this.whitelistForm.controls['request'].value.body.clientId=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchDesc(event: any) {
    this.whitelistForm.controls['request'].value.body.description=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchCreatedBy(event: any) {
    this.whitelistForm.controls['request'].value.body.createdByName=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchCreateDate(event: any) {
    this.whitelistForm.controls['request'].value.body.createdOn=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchUpdatedBy(event: any) {
    this.whitelistForm.controls['request'].value.body.updatedByName=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchUpdatedOn(event: any) {
    this.whitelistForm.controls['request'].value.body.updatedOn=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchStatus(event: any) {
    this.whitelistForm.controls['request'].value.body.status=event
    this.ngOnInit()
    this.paginator.firstPage()
  }
  onSearchSender(event: any) {
    this.whitelistForm.controls['request'].value.body.senderType=event.target.value==='null'?null:event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchAccNo(event: any) {
    console.log(event.target.value)
    this.whitelistForm.controls['request'].value.body.accountNumber=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }
  onSearchDebName(event: any) {
    console.log(event.target.value)
    this.whitelistForm.controls['request'].value.body.debtorName=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }
  onSearchDebCountry(event: any) {
    this.whitelistForm.controls['request'].value.body.debtorCountry=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }
  onSearchBank(event: any) {
    this.whitelistForm.controls['request'].value.body.bankName=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }
  onSearchCurrency(event: any) {
    this.whitelistForm.controls['request'].value.body.currencyCode=event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  selected1: {startDate: any, endDate: any}
  selected2: {startDate: any, endDate: any}
  Ranges:any= {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
  }
  createdDates(event:any){
    this.whitelistForm.controls['request'].value.body.fromCreatedOn = event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null
    this.whitelistForm.controls['request'].value.body.toCreatedOn =event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
    this.ngOnInit()
    this.paginator.firstPage()
  }
  updatedDates(event:any){
    this.whitelistForm.controls['request'].value.body.fromUpdatedOn = event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null
    this.whitelistForm.controls['request'].value.body.toUpdatedOn =event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  openPopUp(id: any, status: any) {
    this.openPop=true
    this.whitelistStatusUpdate.controls['request'].value.body.status = !status;
    this.whitelistStatusUpdate.controls['request'].value.body.id = id;
    this.whitelistStatusUpdate.controls['request'].value.body.updatedBy = this.queueParseData?.USER_ID;
    if(status){
      this.AlertMessage="Are you sure you want to apply 'Inactive' action?"
    }else {
      this.AlertMessage="Are you sure you want to apply 'Active' action?"
    }
  }
  closePopup(event:any) {
    if(event){
      this.service.payInList(this.whitelistStatusUpdate.value).subscribe((data: any) => {
        this.ngOnInit()
      }, error => {
        console.log(error)
      })
    }
    this.openPop=false
  }
  opened:boolean=false
  onClick(){
    this.opened=!this.opened;
    const  sidebar = document.getElementById('sidebar')
    sidebar?.style.setProperty("width",this.opened?"237px":"0");
  }
}

