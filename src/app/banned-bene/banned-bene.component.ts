import { Component, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import moment from 'moment';
import { PageEvent } from '@angular/material/paginator';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LocaleConfig, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-banned-bene',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatTooltip,RouterLink,BsDatepickerModule,NgxDaterangepickerMd],
  templateUrl: './banned-bene.component.html',
  styleUrl: './banned-bene.component.css'
})
export class BannedBeneComponent {
  locale: LocaleConfig = {
    format: 'DD.MM.YYYY',
    separator: ' - ',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    customRangeLabel: 'Custom range'
  };
  selected: { startDate: moment.Moment, endDate: moment.Moment };
  datePickerConfig: any = {
    // Customize your date picker configuration here
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'mo',
    monthFormat: 'MMM, YYYY',
    closeOnSelect: false,
    closeOnSelectDelay: 100,
    onOpenDelay: 0,
    disableKeypress: false,
    allowMultiSelect: false,
    openSelectorTopOfInput: false,
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    showGoToCurrent: true,
    locale: 'en',
    returnedValueType: 'string', // 'string', 'Moment' or 'js-date'
  };
  company: FormGroup;
  companyResponse: any;
  moduleForm: FormGroup;
  moduleFormResponse: any;
  bannedBene: FormGroup;
  updateBannedBene: FormGroup;
  bannedBeneResponse: any;
  openPop: boolean = false
  AlertMessage = ''
  PageNumber: any;
  TotalElements: any;
  NumberOfElement: number = 20;
  queueParseData: any;
  maxDate = new Date();
  createdDateRange: any;
  selectBanned : boolean = false;
  dateRange: Date[];
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private active: ActivatedRoute,
              private service: AdminService,
              private elementRef: ElementRef,
              private localStorage:LocalStorageService) {
    this.bsConfig = {
      containerClass: 'theme-default',
      rangeInputFormat: 'YYYY-MM-DD',
      showWeekNumbers: false,
      isAnimated: true
    };

    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)

    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });

    this.moduleForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl('Module')
        })
      })
    });

    this.bannedBene = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('GET_ALL_BANNED_BENE'),
        body: new FormGroup({
          moduleId: new FormControl(),
          companyId: new FormControl(),
          currencyCode : new FormControl(null),
          country : new FormControl(null),
          accountType : new FormControl(null),
          field : new FormControl(null),
          code : new FormControl(null),
          createdDate : new FormControl(null),
          status : new FormControl(null),
          pageNumber: new FormControl(0),
          numberOfElements: new FormControl(60),
          fromCreatedOn: new FormControl(null),
          toCreatedOn: new FormControl(null)
        })
      })
    });

    this.updateBannedBene = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_STATUS_BANNED_BENE'),
        body: new FormGroup({
          userId: new FormControl(null),
          status: new FormControl(null),
          beneId: new FormControl(null)
        })
      })
    });

  }
  ngOnInit() {
    this.service.payInList(this.moduleForm.value).subscribe((response) => {
      this.moduleFormResponse = response;
    }, error => {
    })
    this.service.payInList(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
    })
  }


  banned(data : any){
    this.selectBanned = false;
    if(data.target.value === null){
      this.bannedBene.controls['request'].value.body.status = null;
      this.moduleDropdown();
    }else{
      this.bannedBene.controls['request'].value.body.status = data.target.value;
      this.moduleDropdown();
    }
  }

  createdDate(event : any , value){
    this.bannedBene.patchValue({request: {body: {
          fromCreatedOn: event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
          toCreatedOn: event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null
        }}})
    this.moduleDropdown();
  }
  openPopUp(id: any, banned: any) {
    this.openPop = true
    this.updateBannedBene.controls['request'].value.body.status = !banned;
    this.updateBannedBene.controls['request'].value.body.beneId = id;
    this.updateBannedBene.controls['request'].value.body.userId = this.queueParseData.USER_ID;
    if (banned) {
      this.AlertMessage = "Are you sure you want to apply 'Inactive' action?"
    } else {
      this.AlertMessage = "Are you sure you want to apply 'Active' action?"
    }
  }

  closePopup(event: any) {
    if (event) {
      this.service.payInList(this.updateBannedBene.value).subscribe((data: any) => {
        this.moduleDropdown();
      }, error => {
        console.log(error)
      })
    }
    this.openPop = false
  }

  country(data: any) {
    if(data.target.value === ''){
      this.bannedBene.controls['request'].value.body.country = null;
      this.moduleDropdown();
    }else{
      this.bannedBene.controls['request'].value.body.country = data.target.value;
      this.moduleDropdown();
    }
  }

  currency(data: any) {
    if(data.target.value === ''){
      this.bannedBene.controls['request'].value.body.currencyCode = null;
      this.moduleDropdown();
    }else {
      this.bannedBene.controls['request'].value.body.currencyCode = data.target.value;
      this.moduleDropdown();
    }
  }

  accountType(data: any) {
    if(data.target.value === ''){
      this.bannedBene.controls['request'].value.body.field = null;
      this.moduleDropdown();
    }else{
      this.bannedBene.controls['request'].value.body.field = data.target.value;
      this.moduleDropdown();
    }

  }

  accountNo(data : any){
    if(data.target.value === ''){
      this.bannedBene.controls['request'].value.body.code = null;
      this.moduleDropdown();
    }else{
      this.bannedBene.controls['request'].value.body.code = data.target.value;
      this.moduleDropdown();
    }
  }

  clearSearch(){
    this.selectBanned = true;
    this.bannedBene.patchValue({
      request: {
        body: {
          code: null, entityType: null,field:null,
          currencyCode: null, status: null, country: null, fromCreatedOn: null,
          toCreatedOn : null
        }
      }
    })
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );

    this.moduleDropdown();
  }
  accountName(data: any) {
    if(data.target.value === ''){
      this.bannedBene.controls['request'].value.body.name = null;
      this.moduleDropdown();
    }else{
      this.bannedBene.controls['request'].value.body.name = data.target.value;
      this.moduleDropdown();
    }
  }

  moduleDropdown() {
    this.bannedBene.controls['request'].value.body.pageNumber = this.PageNumber
    this.bannedBene.controls['request'].value.body.numberOfElements = this.NumberOfElement
    this.service.payInList(this.bannedBene.value).subscribe(response => {
      this.bannedBeneResponse = response.content;
      this.TotalElements = response.totalElements
      this.PageNumber = response.number
    }, error => {
    })
  }

  handlePageEvent(e: PageEvent) {
    this.bannedBene.controls['request'].value.body.pageNumber = e.pageIndex
    this.PageNumber = e.pageIndex
    this.bannedBene.controls['request'].value.body.numberOfElements = e.pageSize
    this.NumberOfElement = e.pageSize
    this.moduleDropdown();
  }
  opened:boolean=false
  onClick(){
    this.opened=!this.opened;
    const  sidebar = document.getElementById('sidebar')
    sidebar?.style.setProperty("width",this.opened?"237px":"0");
  }
}


