import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';

@Component({
  selector: 'app-add-blacklisttype',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink, MatTooltip],
  templateUrl: './add-blacklisttype.component.html',
  styleUrl: './add-blacklisttype.component.css'
})
export class AddBlacklisttypeComponent {
  ModuleForm: FormGroup;
  blacklistTypeMaster: FormGroup;
  moduleById: FormGroup;
  company: FormGroup;
  blacklistTypeForm: FormGroup;
  blacklistTypeDisable: boolean = false;
  blackListTypeMaster: FormGroup
  status: any = false;
  companyResponse: any
  ModuleDropdown: any
  pageNumber: number = 0;
  numberOfElements: number = 20;
  totalElements: any;
  result: any
  resultById: any;
  key: any;
  flag: boolean = false
  checked: boolean = false
  displayStyle = "none";
  alertMessage = ''
  blackListTypeMasterRes: any
  openPop: boolean = false
  AlertMessage = ''
  fontColor = 'green'
  controls: any
  submitted: boolean = false

  constructor(private service: AdminService, private router: Router,
    private localStorage: LocalStorageService
  ) {

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

    this.ModuleForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({ sysLookupName: new FormControl('Module') })
      })
    });


    this.moduleById = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('DATAPOINT_DROP_DOWN_BY_MODULE_ID'),
        body: new FormGroup({
          moduleId: new FormControl(null),
          checkType: new FormControl('Blacklist')
        })
      })
    });

    this.blacklistTypeMaster = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_TYPE_MASTER'),
        body: new FormGroup({
          blackListDesc: new FormControl(),
          updatedBy: new FormControl(this.localStorage.getItem("userId")),
          active: new FormControl(true),
          moduleId: new FormControl(null, Validators.required),
          blackListType: new FormControl(null, Validators.required),
          clientType: new FormControl(3),
          blackListColumn: new FormControl(null, Validators.required),
          tenantId: new FormControl(7),
          createdBy: new FormControl(Number(this.localStorage.getItem("userId"))),
          status: new FormControl(false),
          companyId: new FormControl(null, Validators.required),
          blackListTypeId: new FormControl("")
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
    this.blacklistTypeForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('BLACKLIST_DATAPOINT_ACTIVE'),
        body: new FormGroup({
          columnName: new FormControl()
        })
      })
    });

  }

  save() {
    this.submitted = true
    this.blacklistTypeMaster.controls['request'].value.body.blackListDesc
      = this.blacklistTypeMaster.controls['request'].value.body.blackListType
    if (this.blacklistTypeMaster.valid && !this.blacklistTypeDisable) {
      this.service.payInList(this.blacklistTypeMaster.value).subscribe((data: any) => {
        this.submitted = false
        this.openPop = true
        this.AlertMessage = 'Successful !!'
        this.alertMessage = "Blacklist Added"
      }, error => {
        this.openPop = true
        this.AlertMessage = 'Warning !!'
        this.fontColor = 'red'
        this.alertMessage = error.error.ERROR
      })
    }
  }

  getModule(event: any) {
    if (event != null) {
      this.moduleById.controls['request'].value.body.moduleId = event
      this.service.payInList(this.moduleById.value).subscribe((data: any) => {
        this.resultById = data;
        this.blacklistTypeDisable = false
        this.blacklistTypeMaster.patchValue({ request: { body: { blackListColumn: null } } })
      })
    } else {
      this.resultById = null;
      this.blacklistTypeDisable = false
    }
  }

  ngOnInit() {
    this.controls = this.blacklistTypeMaster['controls']['request']['controls']['body']['controls']

    this.blackListTypeMaster.controls['request'].value.body.pageNumber = this.pageNumber;
    this.blackListTypeMaster.controls['request'].value.body.numberOfElements = this.numberOfElements;

    this.service.payInList(this.blackListTypeMaster.value).subscribe((response) => {
      this.totalElements = response.totalElements;
      this.blackListTypeMasterRes = response.content;
    }, error => {
      console.log(error);
    })
    this.service.payInList(this.ModuleForm.value).subscribe((response: any) => {
      this.ModuleDropdown = response;
    }, error => {
      console.log(error);
    })

    this.service.payInList(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })
  }

  closePopup() {
    this.openPop = false
    if (!this.submitted) {
      this.router.navigate(["/Configuration/Add_BlackList_Type"])
    }
  }
  blacklistTypeCheck(event: any) {
    if (event) {
      this.blacklistTypeForm.patchValue({ request: { body: { columnName: this.resultById.find(x => x.key === event).value } } })
      this.service.payInList(this.blacklistTypeForm.value).subscribe(data => {
        this.blacklistTypeDisable = false
      }, error => {
        console.log(error)
        this.blacklistTypeDisable = true
      })
    } else {
      this.blacklistTypeDisable = false
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
}

