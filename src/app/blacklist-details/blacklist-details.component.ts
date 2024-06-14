import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import dayjs from 'dayjs';
import moment from 'moment';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-blacklist-details',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatTooltip,RouterLink],
  templateUrl: './blacklist-details.component.html',
  styleUrl: './blacklist-details.component.css'
})
export class BlacklistDetailsComponent {
  @ViewChild('paginator') paginator: MatPaginator
  blackList: FormGroup;
  apiResponse: any = [];
  statusSearch = null
  pageNumber: number = 0;
  numberOfElements: number = 20;
  totalElements: any;
  updateBlacklist: FormGroup
  display: boolean = false
  alertMessage = ''
  queueParseData: any;
  openPop: boolean = false
  AlertMessage = ''
  maxDate = new Date()
  createdDateRange
  updatedDateRange
  tabColumns=[
    {
      name:"Module",
      key:'moduleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Company Name",
      key:'companyName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Blacklist Type",
      key:'columnName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Blacklist Value",
      key:'blacklistType',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created Date",
      key:'blacklistValue',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created By",
      key:'debtorName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated Date",
      key:'createdDate',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated By",
      key:'creator',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'updatorName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Action",
      key:'senderType',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    }
  ]

  constructor(private service: AdminService,
    private router: Router,
    private downloadService: DownloadService,
    private elementRef: ElementRef,
    private localStorage: LocalStorageService) {

    this.updateBlacklist = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DETAILS'),
        body: new FormGroup({
          blackListDetailsId: new FormControl(),
          blackListValue: new FormControl(),
          status: new FormControl(),
          updatedBy: new FormControl(this.localStorage.getItem("userId"))
        })
      })
    });


    this.blackList = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DETAILS_ALL'),
        body: new FormGroup({
          pageNumber: new FormControl(0),
          numberOfElements: new FormControl(20),
        })
      })
    });
  }

  CSV() {
    this.blackList.controls['request'].value.body.numberOfElements = this.totalElements
    this.service.payInList(this.blackList.value).subscribe((data: any) => {
      this.downloadService.exportAsCsvFile(data.content, "BlacklistTypeDetails")
    })
  }

  XLS() {
    this.blackList.controls['request'].value.body.numberOfElements = this.totalElements
    this.service.payInList(this.blackList.value).subscribe((data: any) => {
      this.downloadService.exportAsExcelFile(data.content, "BlacklistTypeDetails")
    })
  }

  ngOnInit() {
    this.blackList.controls['request'].value.body.pageNumber = this.pageNumber;
    this.blackList.controls['request'].value.body.numberOfElements = this.numberOfElements;
    this.service.payInList(this.blackList.value).subscribe((response) => {
      this.totalElements = response.totalElements;
      this.apiResponse = response.content;
    }, err => {
      console.log(err);
    })
  }

  clearFilter() {
    this.createdDateRange = null
    this.updatedDateRange = null
    this.blackList = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DETAILS_ALL'),
        body: new FormGroup({
          pageNumber: new FormControl(0),
          numberOfElements: new FormControl(20),
        })
      })
    });
    this.statusSearch = null
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    this.ngOnInit()
  }

  routeData: any

  updateblacklist(i: any) {
    this.routeData = {
      blacklistValue: this.apiResponse[i].blacklistValue,
      flag: this.apiResponse[i].status,
      id: this.apiResponse[i].id,
      moduleId: this.apiResponse[i].moduleId,
      companyId: this.apiResponse[i].companyId,
      module: this.apiResponse[i].module,
      company: this.apiResponse[i].companyName,
      blacklistTypeId: this.apiResponse[i].blackListTypeId
    }
    this.localStorage.setItem("blacklistDetails", JSON.stringify(this.routeData))
    this.router.navigate(['/Configuration/Blacklist_Type_Master'],
      {
        queryParams: {
          blacklistValue: this.apiResponse[i].blacklistValue,
          flag: this.apiResponse[i].status,
          id: this.apiResponse[i].id,
          moduleId: this.apiResponse[i].moduleId,
          companyId: this.apiResponse[i].companyId,
          module: this.apiResponse[i].module,
          company: this.apiResponse[i].companyName,
          blacklistType: this.apiResponse[i].blacklistType
        }
      })
  }

  handlePageEvent(e: PageEvent) {
    this.pageNumber = e.pageIndex
    this.numberOfElements = e.pageSize
    this.ngOnInit()
  }

  changeStatus(event: any, id: any) {
    this.updateBlacklist.controls['request'].value.body.status = !event;
    this.updateBlacklist.controls['request'].value.body.blackListDetailsId = id;
    this.service.updateBlackListMaster(this.updateBlacklist.value).subscribe(data => {
      this.ngOnInit()
    }, error => {
      console.log(error)
    })
  }

  onSearchModule(event: any) {
    console.log(this.blackList.value)
    this.blackList.controls['request'].value.body.moduleName = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchCompany(event: any) {
    this.blackList.controls['request'].value.body.companyName = event.target.value
    console.log(this.blackList.value)
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchColumn(event: any) {
    this.blackList.controls['request'].value.body.columnName = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchBlacklistType(event: any) {
    this.blackList.controls['request'].value.body.blacklistType = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchBlacklistValue(event: any) {
    this.blackList.controls['request'].value.body.blacklistValue = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchCreatedBy(event: any) {
    this.blackList.controls['request'].value.body.creator = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  UpdatedBy(event: any) {
    this.blackList.controls['request'].value.body.updatorName = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  blackListStatus = ['Active', 'Inactive']

  onSearchStatus(event: any) {
    console.log(event.target.value)
    if (event.target.value === 'Active') {
      this.blackList.controls['request'].value.body.status = true
      this.ngOnInit()
      this.paginator.firstPage()
    } else if (event.target.value === 'Inactive') {
      this.blackList.controls['request'].value.body.status = false
      this.ngOnInit()
      this.paginator.firstPage()
    } else {
      this.blackList.controls['request'].value.body.status = null
      this.ngOnInit()
      this.paginator.firstPage()
    }
  }

  fromCreatedOn(event: any) {
    console.log(this.blackList.value)
    this.blackList.controls['request'].value.body.fromCreatedOn = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  toCreatedOn(event: any) {
    console.log(this.blackList.value)
    this.blackList.controls['request'].value.body.toCreatedOn = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }


  selected1: { startDate: any, endDate: any }
  selected2: { startDate: any, endDate: any }
  Ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
  }

  createdDates(event: any) {
    this.blackList.controls['request'].value.body.fromCreatedOn = event ? moment(event[0]).format('YYYY-MM-DD' + 'T00:00:00' + '.000Z') : null
    this.blackList.controls['request'].value.body.toCreatedOn = event ? moment(event[1]).format('YYYY-MM-DD' + 'T23:59:59' + '.000Z') : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  updatedDates(event: any) {
    this.blackList.controls['request'].value.body.fromUpdatedOn = event ? moment(event[0]).format('YYYY-MM-DD' + 'T00:00:00' + '.000Z') : null
    this.blackList.controls['request'].value.body.toUpdatedOn = event ? moment(event[1]).format('YYYY-MM-DD' + 'T23:59:59' + '.000Z') : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  closeAlert() {
    this.display = true
    let Interval = setInterval(() => {
      this.display = false
      clearInterval(Interval)
    }, 300)
  }

  confirmStatus() {
    this.service.updateBlackListMaster(this.updateBlacklist.value).subscribe(data => {
      this.closeAlert()
      this.ngOnInit()
    }, error => {
      console.log(error)
    })
  }

  openPopUp(id: any, status: any) {
    this.openPop = true
    this.updateBlacklist.controls['request'].value.body.status = !status;
    this.updateBlacklist.controls['request'].value.body.blackListDetailsId = id;
    if (status) {
      this.AlertMessage = "Are you sure you want to apply 'Inactive' action?"
    } else {
      this.AlertMessage = "Are you sure you want to apply 'Active' action?"
    }
  }

  closePopup(event: any) {
    if (event) {
      this.service.updateBlackListMaster(this.updateBlacklist.value).subscribe((data: any) => {
        this.ngOnInit()
      }, error => {
        console.log(error)
      })
    }
    this.openPop = false
  }

  clickedInside: any

  @HostListener('document:click', ['$event.target'])
  onPageClick(targetElement) {
    this.clickedInside = this.elementRef.nativeElement.querySelector('.alertHolder').contains(targetElement);
    if (this.clickedInside) {
      if (!this.display) {
        this.closeAlert()
      }
    }
  }
  opened: boolean = false
  onClick() {
    this.opened = !this.opened;
    const sidebar = document.getElementById('sidebar')
    sidebar?.style.setProperty("width", this.opened ? "237px" : "0");
  }
}


