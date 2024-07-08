import { Component, ElementRef } from '@angular/core';
import { CustomruleComponent } from "../customrule/customrule.component";
import { LoaddataComponent } from "../loaddata/loaddata.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { PopupboxComponent } from "../popupbox/popupbox.component";

@Component({
    selector: 'app-custom-rules',
    standalone: true,
    templateUrl: './custom-rules.component.html',
    styleUrl: './custom-rules.component.css',
    imports: [CustomruleComponent, LoaddataComponent, MatTooltip, FormsModule, ReactiveFormsModule, CommonModule, RouterLink, PopupboxComponent]
})
export class CustomRulesComponent {
  customCheckDetailsForm:FormGroup
  customCheckMaster:FormGroup
  ModuleForm: FormGroup
  checkTypeForm: FormGroup
  serviceTypeForm: FormGroup
  updateRulesForComp: FormGroup
  company: FormGroup
  checkCustomDataPoint: FormGroup
  customCheckDetails:any
  moduleDropdown: any
  companyDropdown: any
  checkTypeValues: any
  status:boolean=false
  customCheckDetailsByModuleAndCompany:any
  serviceTypeDropdown: any
  removedService: any[] = []
  customCheckDetailById:any[]=[]
  Operators:any[]=[]
  ServiceStatus:any[]=[]
  disabled:boolean=true
  display: boolean = false
  openPop:boolean=false
  AlertMessage=''
  alertMessage=''
  fontColor=''
  description = '';
  clickedInside:any
  constructor(private active:ActivatedRoute,
              private service :AdminService,
              private router:Router,
              private elementRef :ElementRef,
              private localStorage :LocalStorageService) {
    this.customCheckDetails=this.active.snapshot.queryParams
    this.status=this.customCheckDetails.status==='true'
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
    this.customCheckDetailsForm=new FormGroup({
        request: new FormGroup({
          module:new FormControl('COMPLIANCE'),
          subModule:new FormControl('CUSTOM_CHECK_MASTER_LIST'),
          body:new FormGroup({
            moduleId:new FormControl(null,Validators.required),
            companyId:new FormControl(null,Validators.required),
            checkType:new FormControl(null,Validators.required),
            active:new FormControl(true,Validators.required)
            // moduleId:new FormControl({value: Number(this.customCheckDetails.moduleId), disabled: this.Disabled}, Validators.required),
            // companyId:new FormControl({value: Number(this.customCheckDetails.companyId), disabled: this.Disabled}, Validators.required)
          })
        })
      }
    )
    this.updateRulesForComp = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_STATUS_CUSTOM_CHECK_MASTER'),
        body: new FormGroup({
          customCheckMasterId: new FormControl(),
          status: new FormControl(),
          updatedBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          companyId: new FormControl(Number(this.localStorage.getItem('companyId'))),
          moduleId: new FormControl(),
        })
      })
    })
    this.customCheckMaster=new FormGroup({
        request: new FormGroup({
          module:new FormControl('COMPLIANCE'),
          subModule:new FormControl('CUSTOM_CHECK_DETAILS_BY_ID'),
          body:new FormGroup({
            customCheckMasterId:new FormControl(null),
          })
        })
      }
    )
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

    this.checkCustomDataPoint = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('CUSTOM_CHECK_DATAPOINTS', [Validators.required]),
        body: new FormGroup({
          id: new FormControl(null, Validators.required),
        })
      })
    })
  }
  ngOnInit(){
    // this.customCheckDetailsAPI()
    // this.serviceType(12);
    this.service.payInList(this.ModuleForm.value).subscribe((response) => {
      this.moduleDropdown = response;
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
  customCheckDetailsAPI(){
    if(this.customCheckDetailsForm.valid){
      this.service.payInList(this.customCheckDetailsForm.value).subscribe((data:any)=>{
        this.customCheckDetailsByModuleAndCompany=data
        console.log(this.customCheckDetailsByModuleAndCompany);

      },error => {
        console.log(error)
      })
    }
  }
  serviceType(moduleId:any) {
    this.serviceTypeForm.patchValue({request:{body:{moduleId:moduleId}}})
    this.getDataPoints()
  }
  checkType(value:any){
    this.serviceTypeForm.patchValue({request: {body: {checkType: value}}})
    this.getDataPoints()
  }
  getDataPoints(){
    if (this.serviceTypeForm.valid) {
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
  customCheckDetailsById(id:any,index:any){
    const openElement = document.getElementById('serviceName' + index)
    if(openElement?.ariaExpanded==='true'){
      this.customCheckMaster.patchValue({request:{body:{customCheckMasterId:id}}})
      this.service.payInList(this.customCheckMaster.value).subscribe((data:any)=>{
        this.customCheckDetailById[index]=data
        this.Operators[index]=[];
        this.ServiceStatus[index]=[];
        this.insertionSort(this.customCheckDetailById[index])
        this.customCheckDetailById[index].forEach((res:any,i:any)=>{
          this.getOperators(res.dataPointId,index,i)
        })
      })
    }
  }
  getOperators(key: any, index: any,i:any) {
    this.checkCustomDataPoint.patchValue({request: {body: {id: key}}})
    this.service.payInList(this.checkCustomDataPoint.value).subscribe(({ENUM_VALUES, OPERATORS}: any) => {
      this.Operators[index][i]=OPERATORS || null
      this.ServiceStatus[index][i]=ENUM_VALUES || null
    })
  }
  insertionSort(array: any[]): void {
    for (let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current.sortOrder < array[j]?.sortOrder && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }


  confirmStatus() {
    this.service.payInList(this.updateRulesForComp.value).subscribe((data: any) => {
      // this.ngOnInit()
      this.customCheckDetailsAPI()
    }, error => {
      this.openPop=true
      this.alertMessage=error.error.ERROR || error.error.Warning
      this.AlertMessage='Warning !!'
      this.fontColor='red'
    })
  }
  updateRulesStatus(Id: any, ModuleId: any, CompanyId: any, Status: any) {
    this.updateRulesForComp.patchValue({
      request: {
        body: {
          customCheckMasterId: Id,
          companyId: CompanyId,
          status: !Status,
          moduleId: ModuleId
        }
      }
    })
    this.openPop=true;
    if (Status) {
      this.AlertMessage = "Are you sure you want to apply 'Inactive' action?"
    } else {
      this.AlertMessage = "Are you sure you want to apply 'Active' action?"
    }
  }

  addNew(){
    this.router.navigate(['Configuration/Add_Custom_Rule'])
  }
  activeMsg='Active'
  changeStatus(){
     this.activeMsg=this.activeMsg==="Active"?'Inactive':'Active'
  }
  closePopup(event: any) {
    if (event) {
      this.service.payInList(this.updateRulesForComp.value).subscribe((data: any) => {
        this.customCheckDetailsAPI()
      }, error => {
        this.openPop=true
        this.alertMessage=error.error.ERROR || error.error.Warning
        this.AlertMessage='Warning !!'
        this.fontColor='red'
      })
    } else {
      this.customCheckDetailsAPI()
    }
    this.openPop = false
  }

}

