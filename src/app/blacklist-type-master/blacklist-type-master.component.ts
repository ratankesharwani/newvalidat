import { Component, HostListener } from '@angular/core';
import { AdminService } from '../Service/admin.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';

@Component({
  selector: 'app-blacklist-type-master',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './blacklist-type-master.component.html',
  styleUrl: './blacklist-type-master.component.css'
})
export class BlacklistTypeMasterComponent {
  companyResponse: any;
  blacklistTypeResponse: any
  blacklistValue: any;
  moduleDropdown: any;
  blacklistdetailAll: any;
  updateById: string = 'Save';
  updateBlacklist: FormGroup;
  company: FormGroup;
  ModuleForm: FormGroup;
  blacklistTypeMaster: FormGroup;
  blacklistTypeDropdown: FormGroup;
  blacklistDetailsTypeAll: FormGroup;
  disabledBlacklistTypeDropdown: FormGroup
  pageNumber: any;
  numberOfElements: number = 20;
  totalElements: any;
  queueParseData: any
  displayStyle = "none";
  alertMessage = ''
  blackListTypeId: any
  ModuleId: any = null
  CompanyId: any = null
  Disabled: boolean = false
  BlacklistType: any = null
  BlacklistValue: any = null
  Flag: boolean = false
  UpdateId: any = null
  control1: any
  control2: any
  submitted: boolean = false
  openPop: boolean = false
  AlertMessage = ''
  fontColor = 'green'
  controls: any
  creator :any

  ngOnDestroy() {
    this.localStorage.removeItem("blacklistDetails")
  }

  constructor(private service: AdminService,
    private localStorage :LocalStorageService
  ) {

    const queueData: any = this.localStorage.getItem("blacklistDetails")
    this.queueParseData = JSON.parse(queueData)
    this.creator = this.localStorage.getItem("userId")

    if (this.queueParseData) {
      this.ModuleId = this.queueParseData.moduleId
      this.CompanyId = this.queueParseData.companyId
      this.BlacklistType = this.queueParseData.blacklistTypeId
      this.BlacklistValue = this.queueParseData.blacklistValue
      this.Disabled = true
      this.UpdateId = this.queueParseData.id
      this.Flag = this.queueParseData.flag
      this.updateById = 'Update';
    }
      this.resetForms()

    this.blacklistDetailsTypeAll = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DETAILS_ALL_TYPE_ID'),
        body: new FormGroup({
          blackListTypeId: new FormControl()
        })
      })
    });

    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });

    this.disabledBlacklistTypeDropdown = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACK_LIST_TYPE_DROPDOWN'),
        body: new FormGroup({
          moduleId: new FormControl(this.ModuleId, Validators.required),
          companyId: new FormControl(this.CompanyId, Validators.required)
        })
      })
    });

    this.ModuleForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl('Module')
        })
      })
    });

    this.updateBlacklist = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DETAILS'),
        body: new FormGroup({
          blackListDetailsId: new FormControl(this.UpdateId),
          status: new FormControl(false),
          updatedBy: new FormControl(Number(this.creator))
        })
      })
    });
  }

  ngOnInit() {
    if (this.queueParseData) {
      this.service.payInList(this.disabledBlacklistTypeDropdown.value).subscribe((response: any) => {
        this.blacklistTypeResponse = response;
        this.blackListTypeIdIndex(this.BlacklistType)
      }, error => {
        console.log(error);
      })
    }

    this.service.payInList(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })

    this.service.payInList(this.ModuleForm.value).subscribe(response => {
      this.moduleDropdown = response;
    }, error => {
      console.log(error);
    })
  }

  save() {
    this.submitted = true
    if (this.queueParseData) {
      this.service.updateBlackListMasterDetails(this.updateBlacklist.value).subscribe(() => {
        this.submitted = false
        this.service.payInList(this.blacklistDetailsTypeAll.value).subscribe((response: any) => {
          this.openPop = true
          this.AlertMessage = 'Successful !!'
          this.alertMessage = "Status Updated Successfully"
          this.blacklistdetailAll = response;
        })
      }, error => {
        console.log(error)
      })
    } else {
   if(this.blacklistTypeMaster.valid){
     this.service.payInList(this.blacklistTypeMaster.value).subscribe(data => {
       this.submitted = false
       this.openPop = true
       this.AlertMessage = 'Successful !!'
       this.fontColor = 'green'
       this.alertMessage = "Blacklist Type added"
       this.blackListTypeIdIndex(this.blackListTypeId)
       this.resetForms()
     }, err => {
       this.openPop = true
       this.AlertMessage = 'Warning !!'
       this.fontColor = 'red'
       this.alertMessage = err.error.ERROR
     })
   }
    }
  }
  resetForms(){
    this.blacklistTypeDropdown = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACK_LIST_TYPE_DROPDOWN'),
        body: new FormGroup({
          moduleId: new FormControl({value: this.ModuleId, disabled: this.Disabled}, Validators.required),
          companyId: new FormControl({value: this.CompanyId, disabled: this.Disabled}, Validators.required)
        })
      })
    });
    this.blacklistTypeMaster = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DETAILS'),
        body: new FormGroup({
          blackListValue: new FormControl({value: this.BlacklistValue, disabled: this.Disabled}, Validators.required),
          createdBy: new FormControl(Number(this.creator)),
          blackListTypeId: new FormControl({value: this.BlacklistType, disabled: this.Disabled}, Validators.required),
          status: new FormControl(this.Flag, Validators.required)
        })
      })
    });
    this.control1 = this.blacklistTypeDropdown['controls']['request']['controls']['body']['controls']
    this.control2 = this.blacklistTypeMaster['controls']['request']['controls']['body']['controls']
  }

  blackListTypeIdIndex(value: any) {
    this.blackListTypeId = value
    if (value != null) {
      this.blackListTypeDetails(value);
    } else {
      this.blacklistdetailAll = null
    }
  }

  companyName() {
    this.blackListType();
  }

  getModuleId() {
    this.blackListType();
  }

  blackListType() {
    if (this.blacklistTypeDropdown.valid) {
      this.service.payInList(this.blacklistTypeDropdown.value).subscribe((response: any) => {
        this.blacklistTypeResponse = response;
      }, error => {
        console.log(error);
      })
    } else {
      this.blacklistTypeResponse = null;
    }
  }

  onStatusChange(event: any) {
    this.updateBlacklist.controls['request'].value.body.status = event.target.checked
  }

  blackListTypeDetails(id: any) {
    this.blacklistDetailsTypeAll.controls["request"].value.body.blackListTypeId = id
    this.service.payInList(this.blacklistDetailsTypeAll.value).subscribe((response: any) => {
      this.blacklistdetailAll = response;
    }, error => {
      console.log(error);
    })
  }

  ChangeStatus(event: any, id: any) {
    this.updateBlacklist.controls['request'].value.body.status = !event;
    this.updateBlacklist.controls['request'].value.body.blackListDetailsId = id;
    this.service.updateBlackListMaster(this.updateBlacklist.value).subscribe(data => {
      this.blackListTypeIdIndex(this.blackListTypeId)
      // this.ngOnInit()
    }, error => {
      console.log(error)
    })
  }

  closePopup() {
    this.openPop=false
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
}

