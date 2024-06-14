import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import moment from 'moment';
import dayjs from "dayjs";
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-blacklisttype',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatTooltip,RouterLink],
  templateUrl: './blacklisttype.component.html',
  styleUrl: './blacklisttype.component.css'
})
export class BlacklisttypeComponent {
  @ViewChild('paginator') paginator: MatPaginator
  blackListTypeMaster: FormGroup;
  Response: any = [];
  result: any;
  pageNumber: number = 0;
  numberOfElements: number = 20;
  totalElements: any;
  updateBlacklistTypeMaster: FormGroup
  animation: boolean = true
  display: boolean = false
  alertMessage = ''
  queueParseData: any;
  openPop: boolean = false
  AlertMessage = ''
  statusSearch = null
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
      name:"DataPoint Column",
      key:'columnName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Blacklist Type",
      key:'blacklistType',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Blacklist Desc",
      key:'blacklistValue',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created Date",
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
      name:"Created By",
      key:'creator',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated By",
      key:'updatorName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'senderType',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    },
    {
      name:"Action",
      key:'complianceStatus',
      search:true,
      dataType:"select",
      value:'',
      class:'form-select'
    }
  ]

  constructor(private service: AdminService,
              private downloadService: DownloadService,
               private elementRef: ElementRef,
              private localStorage:LocalStorageService) {
    this.updateBlacklistTypeMaster = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_TYPE_MASTER'),
        body: new FormGroup({
          updatedBy: new FormControl(this.localStorage.getItem("userId")), //done
          blackListDesc: new FormControl(), //done
          active: new FormControl(false),
          moduleId: new FormControl(), //done
          blackListType: new FormControl(), //done
          status: new FormControl(),//done
          companyId: new FormControl(),//done
        })

      })
    });
    this.blackListTypeMaster = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('BLACKLIST_TYPE_MASTER_ALL', [Validators.required]),
        body: new FormGroup({
          numberOfElements: new FormControl(20),
          pageNumber: new FormControl(0),
          moduleName: new FormControl(), //done
          fromCreatedOn: new FormControl(),
          toCreatedOn: new FormControl(),
          columnName: new FormControl,
          companyName: new FormControl(),//done
          status: new FormControl(),//done
          creator: new FormControl(),
          blackListDesc: new FormControl(), //done
          blackListType: new FormControl(), //done
          fromUpdatedOn: new FormControl(),
          toUpdatedOn: new FormControl(),
          createdBy: new FormControl(),
          updatedBy: new FormControl()
        })
      })
    });

  }

  CSV() {
    this.blackListTypeMaster.controls['request'].value.body.numberOfElements = this.totalElements
    this.service.payInList(this.blackListTypeMaster.value).subscribe((data: any) => {
      this.downloadService.exportAsCsvFile(data.content, "BlacklistTypeMasterCSV")
    })
  }

  XLS() {
    this.blackListTypeMaster.controls['request'].value.body.numberOfElements = this.totalElements
    this.service.payInList(this.blackListTypeMaster.value).subscribe((data: any) => {
      this.downloadService.exportAsExcelFile(data.content, "BlacklistTypeMasterXLS")
    })
  }

  ngOnInit() {
    this.blackListTypeMaster.controls['request'].value.body.pageNumber = this.pageNumber;
    this.blackListTypeMaster.controls['request'].value.body.numberOfElements = this.numberOfElements;

    this.service.payInList(this.blackListTypeMaster.value).subscribe((response) => {
      this.totalElements = response.totalElements;
      this.Response = response.content;
    }, err => {
      console.log(err);
    })
  }

  clearFilter() {
    this.createdDateRange = null
    this.updatedDateRange = null
    this.blackListTypeMaster.patchValue({
      request:
        {
          body:
            {
              moduleName: null,
              companyName: null,
              columnName: null,
              blackListType: null,
              blackListDesc: null,
              fromUpdatedOn: null,
              toUpdatedOn: null,
              createdBy: null,
              fromCreatedOn: null,
              toCreatedOn: null,
              updatedBy: null,
              status: null
            }
        }
    })
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    this.statusSearch = null
    this.ngOnInit()
  }


  handlePageEvent(e: PageEvent) {
    this.pageNumber = e.pageIndex
    this.numberOfElements = e.pageSize
    this.ngOnInit()
  }

  blackListStatus = [{display: 'Active', value: true},
    {display: 'Inactive', value: false}]

  changeStatus(event: any, id: any) {
    this.updateBlacklistTypeMaster.controls['request'].value.body.status = !event;
    this.updateBlacklistTypeMaster.controls['request'].value.body.blackListTypeId = id;
    this.service.updateBlackListMaster(this.updateBlacklistTypeMaster.value).subscribe(data => {
      this.ngOnInit()
    }, error => {
      console.log(error)
    })
  }

  onSearchModule(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.moduleName = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchCompany(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.companyName = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchColumn(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.columnName = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchBlacklistType(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.blacklistType = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchBlacklistValue(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.blacklistValue = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  onSearchStatus(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.status = event
    this.ngOnInit()
    this.paginator.firstPage()
  }

  fromCreatedOn(event: any) {
    this.ngOnInit()
    this.paginator.firstPage()
  }

  toCreatedOn(event: any) {
    this.ngOnInit()
    this.paginator.firstPage()
  }

  fromUpdatedOn(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.fromUpdatedOn = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  toUpdatedOn(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.toUpdatedOn = event.target.value
    this.ngOnInit()
    this.paginator.firstPage()
  }

  UpdatedBy(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.updatorName = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  CreatedBy(event: any) {
    this.blackListTypeMaster.controls['request'].value.body.creator = event.target.value ? event.target.value : null
    this.ngOnInit()
    this.paginator.firstPage()
  }

  closeConfirmModal() {
    const element = document.getElementById('confirmModal')
    element?.style.setProperty("display", "none")
  }


  openConfirmModal(id: any, status: any) {
    this.updateBlacklistTypeMaster.controls['request'].value.body.status = !status;
    this.updateBlacklistTypeMaster.controls['request'].value.body.blackListTypeId = id;
    const element = document.getElementById('confirmModal')
    element?.style.setProperty("display", "block")
  }

  confirmStatus() {
    this.service.updateBlackListMaster(this.updateBlacklistTypeMaster.value).subscribe(data => {
      this.closeAlert()
      this.ngOnInit()
    }, error => {
      console.log(error)
    })
  }


  openPopUp(id: any, status: any) {
    this.openPop = true
    this.updateBlacklistTypeMaster.controls['request'].value.body.status = !status;
    this.updateBlacklistTypeMaster.controls['request'].value.body.blackListTypeId = id;
    if (status) {
      this.AlertMessage = "Are you sure you want to apply 'Inactive' action?"
    } else {
      this.AlertMessage = "Are you sure you want to apply 'Active' action?"
    }
  }

  closePopup(event: any) {
    if (event) {
      this.service.updateBlackListMaster(this.updateBlacklistTypeMaster.value).subscribe((data: any) => {
        this.ngOnInit()
      }, error => {
        console.log(error)
      })
    } else {
      this.ngOnInit()
    }
    this.openPop = false
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
    this.blackListTypeMaster.patchValue({
      request: {
        body: {
          "fromCreatedOn": event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
          "toCreatedOn": event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
        }
      }
    })
    this.ngOnInit()
    this.paginator.firstPage()
  }

  updatedDates(event: any) {
    this.blackListTypeMaster.patchValue({
      request: {
        body: {
          "fromUpdatedOn": event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
          "toUpdatedOn": event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
        }
      }
    })
    this.ngOnInit()
    this.paginator.firstPage()
  }

  closeAlert() {
    this.display = true
    let Interval = setInterval(() => {
      this.animation = true
      this.display = false
      clearInterval(Interval)
    }, 300)
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
  opened:boolean=false
  onClick(){
    this.opened=!this.opened;
    const  sidebar = document.getElementById('sidebar')
    sidebar?.style.setProperty("width",this.opened?"237px":"0");
  }
}
