import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { PopupboxConfirmationComponent } from '../popupbox-confirmation/popupbox-confirmation.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-service-configuration',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule,FormsModule,PopupboxConfirmationComponent,MatTooltip],
  templateUrl: './service-configuration.component.html',
  styleUrl: './service-configuration.component.css'
})
export class ServiceConfigurationComponent {
  ModuleForm: FormGroup
  company: FormGroup
  displayStyle='none'
  alertMessage=''
  serviceConfigs: FormGroup
  serviceTypeForm: FormGroup
  serviceConfigsDetails: FormGroup
  ModuleDropdown: any
  companyDropdown: any
  serviceTypeDropdown: any
  Status: any
  controls:any
  detailsControls:any
  submitted:boolean=false
  AlertMessage='Successfully'
  openPop:boolean=false
  fontColor='green'

  constructor(private service: AdminService,
              private router: Router,
              private fb: FormBuilder,
              private localStorage:LocalStorageService,
              private cdr: ChangeDetectorRef) {
    this.ModuleForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl('Module')
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
        subModule: new FormControl('SERVICE_FOR_COMPANY', [Validators.required]),
        body: new FormGroup({
          moduleId: new FormControl(null, Validators.required),
          companyId: new FormControl(null, Validators.required)
        })
      })
    });


    this.serviceConfigs = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('TO_CREATE_NEW_RULE'),
        body: this.fb.group({
          companyId: new FormControl(null, Validators.required),
          moduleId: new FormControl(null, Validators.required),
          createdBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          ruleName: new FormControl(null, Validators.required),
          status: new FormControl(false),
          details: this.fb.array([])
        })
      })
    });

    this.serviceConfigsDetails = new FormGroup({
      serviceTypeId: new FormControl(null),
      operatorId: new FormControl(null),
      status: new FormControl(false)
    })
  }
  get detailsControl() {
    return this.serviceConfigs['controls']['request']['controls']['body']['controls']['details'];
  }

  ngOnInit() {
    this.submitted=false
    this.controls = this.serviceConfigs['controls']['request']['controls']['body']['controls']
    this.service.payInList(this.ModuleForm.value).subscribe((response) => {
      this.ModuleDropdown = response;
    })
    this.service.payInList(this.company.value).subscribe(response => {
      this.companyDropdown = response;
    })
  }

  getCompanyId(event: any) {
    this.serviceTypeForm.patchValue({request:{body:{companyId:event}}})
    this.serviceType();
  }

  getModuleId(event: any) {
    this.serviceTypeForm.patchValue({request:{body:{moduleId:event}}})
    this.serviceType();
  }

  serviceType() {
    if (this.serviceTypeForm.controls['request'].value.body.moduleId
      && this.serviceTypeForm.controls['request'].value.body.companyId) {
      this.service.payInList(this.serviceTypeForm.value).subscribe((response: any) => {
        if (response != null) {
          this.serviceTypeDropdown = response.services
          console.log(this.serviceTypeDropdown)
          const detail = this.detailsControl as FormArray;
          detail.clear();
          if (this.serviceTypeDropdown && Array.isArray(this.serviceTypeDropdown) && this.serviceTypeDropdown.length > 0) {
            this.serviceTypeDropdown.forEach((service:any) => {
              this.addMoreService(service.id);
            });
          }
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


  addMoreService(id) {
    const detail = this.detailsControl as FormArray;
    detail.push(
      this.fb.group({
        serviceTypeId: new FormControl(id, [RxwebValidators.unique(), Validators.required]),
        operatorId: new FormControl(1, Validators.required),
        status: new FormControl(false, Validators.required)
      })
    );
  }

  removeFalseService() {
    const detail = this.detailsControl as FormArray;
    for (let i = detail.length - 1; i >= 0; i--) {  // Looping backward
      const formGroup = detail.at(i) as FormGroup;
      if (formGroup.get('status')?.value === false) {
        detail.removeAt(i);  // Safe to remove without affecting remaining elements
      }
    }
  }

  onStatusChange(event: Event, formIndex: number, serviceId: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const formGroup = this.detailsControl.controls[formIndex] as FormGroup;
    formGroup.patchValue({status:isChecked,serviceTypeId:serviceId})
  }

  saveServiceConfigs() {
    this.submitted=true
    this.cdr.detectChanges();
    this.removeFalseService()
    this.serviceTypeForm.markAsDirty()
    this.serviceTypeForm.markAsTouched()
    if (this.serviceConfigs.valid){
      this.service.payInList(this.serviceConfigs.value).subscribe((data:any) => {
        this.submitted=false
        this.AlertMessage='Successful'
        this.openPop=true
        this.alertMessage = data.MSG
        this.fontColor='green'
      }, error => {
        this.AlertMessage='Warning !!'
        this.openPop=true
        this.alertMessage = error.error.ERROR
        this.fontColor='red'
      })
    }
  }
  clearFilter(){
    this.serviceConfigs.patchValue({request:{body:{
          companyId:null,
          moduleId:null,
          ruleName:null,
          status:false,
    }}})
    this.detailsControl.controls.splice(0)
    this.ngOnInit()
  }
 
  closePopup(){
    this.openPop=!this.openPop
    if(!this.submitted){
      this.clearFilter()
      this.router.navigate(['/Configuration/Add_Service_Rule'])
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.saveServiceConfigs()
  }
  goBack(){
    this.router.navigate(['Configuration/Add_Service_Rule'])
  }
}
