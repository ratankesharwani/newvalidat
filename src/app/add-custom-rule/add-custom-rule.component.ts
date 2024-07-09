import { Component, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { LocalStorageService } from '../Service/local-storage.service';
import { PopupboxConfirmationComponent } from "../popupbox-confirmation/popupbox-confirmation.component";
import { PopupboxComponent } from "../popupbox/popupbox.component";

@Component({
  selector: 'app-add-custom-rule',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, MatTooltip, PopupboxConfirmationComponent, PopupboxComponent],
  templateUrl: './add-custom-rule.component.html',
  styleUrl: './add-custom-rule.component.css'
})
export class AddCustomRuleComponent {
closePopup1() {
throw new Error('Method not implemented.');
}
  ModuleForm: FormGroup
  company: FormGroup
  alertMessage = ''
  serviceConfigs: FormGroup
  serviceTypeForm: FormGroup
  checkTypeForm: FormGroup
  serviceConfigsDetails: FormGroup
  getOperator: FormGroup
  checkCustomDataPoint: FormGroup
  checkRuleName: FormGroup
  ModuleDropdown: any
  ServiceStatus: any[] = []
  Operators: any[] = [];
  enableDropdown: any[] = []
  dataTypes: any[] = []
  companyDropdown: any
  checkTypeValues: any
  serviceTypeDropdown: any
  UniqueRuleName: boolean = false
  RuleName: any
  Description: any
  removedService: any[] = []
  Status: any
  controls: any
  submitted: boolean = false
  AlertMessage = 'Successfully'
  openPop: boolean = false
  fontColor = 'green'
riskAssessmentCreationResponse: any;
openPopWithAction: any;
  constructor(private service: AdminService,
              private router: Router,
              private fb: FormBuilder,
            private localStorage:LocalStorageService) {
    this.ModuleForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl('Module')
        })
      })
    });
    this.checkTypeForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl('Check Type')
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

    this.serviceTypeForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('DATAPOINT_DROP_DOWN_BY_MODULE_ID', [Validators.required]),
        body: new FormGroup({
          moduleId: new FormControl(null, Validators.required),
          checkType: new FormControl(null, Validators.required),
        })
      })
    });

    this.getOperator = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('OPERATORS_BY_DATATYPE_ID', [Validators.required]),
        body: new FormGroup({
          datatypeId: new FormControl(null, Validators.required),
        })
      })
    })
    this.checkCustomDataPoint = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('CUSTOM_CHECK_DATAPOINTS', [Validators.required]),
        body: new FormGroup({
          id: new FormControl(null, Validators.required),
        })
      })
    })
    this.checkRuleName = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('CHECK_CUSTOM_CHECK_RULE_NAME', [Validators.required]),
        body: new FormGroup({
          customCheckRuleName: new FormControl(null, Validators.required),
          companyId: new FormControl(null, Validators.required),
          moduleId: new FormControl(null, Validators.required),
        })
      })
    })

    this.serviceConfigs = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ADD_NEW_CUSTOM_CHECK'),
        body: this.fb.group({
          companyId: new FormControl(null, Validators.required),
          moduleId: new FormControl(null, Validators.required),
          checkTypeId: new FormControl(null, Validators.required),
          createdBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          customCheckRuleName: new FormControl(null, Validators.required),
          status: new FormControl(false),
          description: new FormControl(null, Validators.required),
          detail: this.fb.array([])
        })
      })
    });

    this.serviceConfigsDetails = new FormGroup({
      dataPointId: new FormControl(null),
      operatorId: new FormControl(null),
      value: new FormControl(),
      andOr: new FormControl(true)
    })
  }

  ngOnInit() {
    this.submitted = false
    this.controls = this.serviceConfigs['controls']['request']['controls']['body']['controls']
    this.addMoreService()
    this.service.payInList(this.ModuleForm.value).subscribe((response) => {
      this.ModuleDropdown = response;
    }, error => {
    })
    this.service.payInList(this.company.value).subscribe(response => {
      this.companyDropdown = response;
    }, error => {
    })
    this.service.payInList(this.checkTypeForm.value).subscribe(response => {
      this.checkTypeValues=response;
    }, error => {
    })
  }
  getCompanyId(event: any) {
    this.checkRuleName.patchValue({request: {body: {companyId: event}}})
    this.checkRule()
    this.resetDataPoints()
  }

  getModuleId(event: any) {
    this.serviceTypeForm.patchValue({request: {body: {moduleId: event}}})
    this.serviceType();
    this.checkRuleName.patchValue({request: {body: {moduleId: event}}})
    this.checkRule()
    this.resetDataPoints()
  }
  getCheckType(id:any){
    this.serviceTypeForm.patchValue({request: {body: {checkType: id?this.checkTypeValues.find(x=>x.id==id).display_field:null}}})
    this.serviceType();
    this.resetDataPoints()
  }
  resetDataPoints(){
    this.detailsControl.clear()
    this.addMoreService()
  }
  getDesc(event: any) {
    this.Description = event
  }
  ruleName(event: any) {
    this.RuleName = event
    this.checkRuleName.patchValue({request: {body: {customCheckRuleName: event}}})
    this.checkRule()
  }
  checkRule() {
    if (this.checkRuleName.valid) {
      this.service.payInList(this.checkRuleName.value).subscribe((data: any) => {
        this.UniqueRuleName = false
      }, error => {
        this.UniqueRuleName = true
      })
    }else {
      this.UniqueRuleName = false
    }
  }
  serviceType() {
    if(this.serviceTypeForm.valid) {
      this.service.payInList(this.serviceTypeForm.value).subscribe((response: any) => {
        if (response != null) {
          this.serviceTypeDropdown = response
          this.removedService = response
        } else {
          this.serviceTypeDropdown = null
        }
      }, error => {
        console.log(error);
      })
    } else {
      this.serviceTypeDropdown = null
    }
  }
  get detailsControl() {
    return this.serviceConfigs['controls']['request']['controls']['body']['controls']['detail'];
  }

  addMoreService() {
    const detail = this.detailsControl as FormArray;
    detail.push(
      this.fb.group({
        // dataPointId: new FormControl(null, [RxwebValidators.unique(), Validators.required]),
        dataPointId: new FormControl(null, Validators.required),
        operatorId: new FormControl(null, Validators.required),
        value: new FormControl(null, Validators.required),
        andOr: new FormControl(null,Validators.required),
        sortOrder: new FormControl(this.detailsControl.value.length)
      })
    );
    this.addValidators()
  }
  addValidators(){
    this.detailsControl.value.forEach((element, i) => {
      if(!this.detailsControl.controls[i].controls['andOr']?.errors){
        this.detailsControl.controls[i].controls['andOr'].addValidators(Validators.required)
      }
    })
    this.removeValidators()
  }
  removeValidators(){
    this.detailsControl?.controls[this.detailsControl?.controls.length-1]?.controls['andOr'].clearValidators()
    this.detailsControl?.controls[this.detailsControl?.controls.length-1]?.controls['andOr'].updateValueAndValidity(true)
    this.detailsControl?.controls[this.detailsControl?.controls.length-1]?.patchValue({andOr:null})
  }

  removeService(index: any) {
    this.detailsControl.removeAt(index)
    this.enableDropdown.splice(index, 1)
    this.dataTypes.splice(index, 1)
    this.Operators.splice(index, 1)
    this.ServiceStatus.splice(index, 1)
    this.detailsControl.value.forEach((element, i) => {
      this.detailsControl.controls[i].patchValue({sortOrder:i})
    })
    const element = document.getElementById('add-more')
    element?.style.setProperty("pointer-events", "auto")
    this.addValidators()
  }

  arrayControls(index: any, data: any, operation: any): any {
    return this.detailsControl.controls[index].controls[data][operation]
  }

  saveServiceConfigs() {
    this.submitted = true
    if (this.serviceConfigs.valid) {
      this.service.payInList(this.serviceConfigs.value).subscribe((data: any) => {
        this.submitted = false
        this.AlertMessage = 'Successful ..'
        this.openPop = true
        this.alertMessage = data.MSG
        this.fontColor = 'green'
      }, error => {
        this.fontColor = 'red'
        this.AlertMessage = 'Warning !!'
        this.openPop = true
        this.alertMessage = error.error?.ERROR || error.error?.Warning || error.error?.Error
      })
    }
  }
  clearFilter() {
    this.serviceConfigs.patchValue({
      request: {
        body: {
          checkTypeId:null,
          companyId: null,
          moduleId: null,
          ruleName: null,
          status: false,
        }
      }
    })
    this.detailsControl.controls.splice(0)
    this.ngOnInit()
  }
  getOperators(key: any, index: any) {
    if (key) {
      this.checkCustomDataPoint.patchValue({request: {body: {id: key}}})
      this.service.payInList(this.checkCustomDataPoint.value).subscribe((data: any) => {
        this.enableDropdown[index] = (data.INPUT_TYPE === 'select');
        this.Operators[index] = data?.OPERATORS
        this.ServiceStatus[index] = data?.ENUM_VALUES
        this.dataTypes[index]=data?.DATA_TYPE
      })
    } else {
      this.enableDropdown[index] = !this.enableDropdown[index]
      this.Operators.pop()
      this.dataTypes.pop()
    }
  }
  closePopup() {
    this.openPop = !this.openPop
    if (!this.submitted) {
      // this.clearFilter()
      this.router.navigate(['/Configuration/Custom_Rule'])
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.saveServiceConfigs()
  }
  goBack(){
    this.router.navigate(['Configuration/Custom_Rule'])
  }
}



