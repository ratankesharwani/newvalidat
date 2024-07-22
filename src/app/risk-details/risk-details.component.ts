import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { PopupboxConfirmationComponent } from "../popupbox-confirmation/popupbox-confirmation.component";

@Component({
  selector: 'app-risk-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink, PopupboxConfirmationComponent],
  templateUrl: './risk-details.component.html',
  styleUrl: './risk-details.component.css'
})
export class RiskDetailsComponent {
  riskAssessmentCreation: FormGroup;
  company: FormGroup;
  dataPoint: FormGroup;
  module: FormGroup;
  riskAssessmentList: FormGroup;
  riskAssessmentDetails: FormGroup;
  riskAssessmentDetailsDataPoint: FormGroup;
  detailsOfRiskDetails: FormGroup;
  getRiskAssessmentDetails: FormGroup;
  moduleResponse: any;
  companyResponse: any;
  dataPointResponse: any;
  riskAssessmentListResponse: any;
  moduleId: any;
  companyId: any;
  assessmentName: any;
  description: any;
  moduleName: any;
  companyName: any;
  dataPointName: any;
  getRiskAssessmentDetailsResponse: any;
  submitted: boolean = false;
  details: any[] = [];
  riskAssessmentDatapointsDetails: any[] = [];
  datapoint: any[] = [];
  score: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  AlertMessage = 'Successfully';
  openPop: boolean = false;
  fontColor = 'green';
  alertMessage = '';
  saveValue: any = "Save";

  constructor(private service: AdminService,
              private router: Router,
              private active: ActivatedRoute,
              private fb: FormBuilder,
              private localStorage:LocalStorageService) {
    this.moduleId = this.active.snapshot.queryParams['moduleId'];
    this.companyId = this.active.snapshot.queryParams['companyId'];
    this.description = this.active.snapshot.queryParams['description'];
    this.dataPointName = this.active.snapshot.queryParams['dataPoint'];
    this.assessmentName = this.active.snapshot.queryParams['name'];

    this.riskAssessmentCreation = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_MASTER_CREATION'),
        body: new FormGroup({
          moduleId: new FormControl({value: null, disabled: true}, Validators.required),
          companyId: new FormControl({value: null, disabled: true}, Validators.required),
          dataPointId: new FormControl({value: null, disabled: true}, Validators.required),
          createdBy: new FormControl(Number(this.localStorage.getItem("userId"))),
          status: new FormControl(false),
          name: new FormControl(null, Validators.required),
          description: new FormControl({value: null, disabled: true}, Validators.required),
        })
      })
    });

    this.module = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('Module')})
      })
    });

    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });


    this.riskAssessmentList = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_LIST'),
        body: new FormGroup({
          moduleId: new FormControl(null),
          companyId: new FormControl(null)
        })
      })
    });

    this.getRiskAssessmentDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('GET_RISK_ASSESSMENT_DETAILS'),
        body: new FormGroup({
          masterId: new FormControl(Number(this.active.snapshot.queryParams['id']))
        })
      })
    });

    this.riskAssessmentDetailsDataPoint = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_DETAILS_DATAPOINTS'),
        body: new FormGroup({
          name: new FormControl(null),
          riskAssessmentDatapoints: new FormControl([])
        })
      })
    });

    this.dataPoint = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_DATAPOINTS'),
        body: new FormGroup({
          moduleId: new FormControl(null),
          companyId: new FormControl(null),
        })
      })
    });

    this.riskAssessmentDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_DETAILS'),
        body: this.fb.group({
          masterId: new FormControl(Number(this.active.snapshot.queryParams['id'])),
          riskDetails: this.fb.array([])
        })
      })
    });

    this.detailsOfRiskDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_DETAILS'),
        body: this.fb.group({
          value: new FormControl(null),
          score: new FormControl(null)
        })
      })
    });
  }

  updateService(data: any) {
    const detail = this.detailsControl as FormArray;
    detail.push(
      this.fb.group({
        value: new FormControl(data.Value, [RxwebValidators.unique(), Validators.required]),
        score: new FormControl(data.Score, Validators.required),
      })
    );
  }

  ngOnInit() {
    this.service.payInList(this.getRiskAssessmentDetails.value).subscribe(response => {
      this.getRiskAssessmentDetailsResponse = response;
      console.log(this.getRiskAssessmentDetailsResponse);
      if (this.getRiskAssessmentDetailsResponse) {
        this.saveValue = "Update";
        for (let i = 0; i < this.getRiskAssessmentDetailsResponse.length; i++) {
          this.updateService(this.getRiskAssessmentDetailsResponse[i]);
        }
      } else {
        this.addMoreService();
        this.saveValue = "Save";
      }
    }, error => {
      console.log(error);
    })

    if (this.active.snapshot.queryParams['id']) {
      this.riskAssessmentCreation.controls['request'].value.body.moduleId = this.moduleId;
      this.service.payInList(this.module.value).subscribe((response: any) => {
        this.moduleResponse = response;
        for (let i = 0; i < this.moduleResponse.length; i++) {
          if (this.moduleResponse[i].id == this.active.snapshot.queryParams['moduleId']) {
            this.moduleName = this.moduleResponse[i].display_field;
          }
        }
      }, error => {
        console.log(error);
      })
      this.service.payInList(this.company.value).subscribe(response => {
        this.companyResponse = response;
        for (let i = 0; i < this.companyResponse.length; i++) {
          if (this.companyResponse[i].key == this.active.snapshot.queryParams['companyId']) {
            this.companyName = this.companyResponse[i].value;
          }
        }
      }, error => {
        console.log(error);
      })
      this.riskAssessmentCreation.controls['request'].value.body.companyId = this.companyId;
      this.riskAssessmentCreation.controls['request'].value.body.name = this.assessmentName;
    }
    this.riskAssessmentList.controls['request'].value.body.moduleId = this.active.snapshot.queryParams['moduleId']
    this.riskAssessmentList.controls['request'].value.body.companyId = this.active.snapshot.queryParams['companyId']
    this.service.payInList(this.riskAssessmentList.value).subscribe(response => {
      this.riskAssessmentListResponse = response;
    }, error => {
      console.log(error);
    })
    this.service.payInList(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })
    this.riskAssessmentDetailsDataPoint.controls['request'].value.body.name = this.dataPointName;
    this.service.payInList(this.riskAssessmentDetailsDataPoint.value).subscribe((response: any) => {
      // this.riskAssessmentDetailsDataPointResponse = response;
      this.datapoint.push(response.ENUM_VALUES)
    }, error => {
      console.log(error);
    })


  }

  assessmentNameDropdown(data: any) {
    this.datapoint.splice(0);
    this.detailsControl.clear();
    console.log(this.details);
    for (let i = 0; i < this.riskAssessmentListResponse.length; i++) {
      if (this.riskAssessmentListResponse[i].name == data.target.value) {
        this.riskAssessmentDetailsDataPoint.controls['request'].value.body.name = this.riskAssessmentListResponse[i].datapoint;
        this.dataPointName = this.riskAssessmentListResponse[i].datapoint;
        this.getRiskAssessmentDetails.controls['request'].value.body.masterId = this.riskAssessmentListResponse[i].id;
        this.service.payInList(this.getRiskAssessmentDetails.value).subscribe(response => {
          this.getRiskAssessmentDetailsResponse = response;
          console.log(this.getRiskAssessmentDetailsResponse);
          if (this.getRiskAssessmentDetailsResponse) {
            this.saveValue = "Update";
            for (let i = 0; i < this.getRiskAssessmentDetailsResponse.length; i++) {
              this.updateService(this.getRiskAssessmentDetailsResponse[i]);
            }
          } else {
            this.addMoreService();
            this.saveValue = "Save";
          }
        }, error => {
          console.log(error);
        })
        this.service.payInList(this.riskAssessmentDetailsDataPoint.value).subscribe((response: any) => {
          this.datapoint.push(response.ENUM_VALUES);
        }, error => {
          console.log(error);
        })

      }
    }
  }

  get detailsControl() {
    return this.riskAssessmentDetails['controls']['request']['controls']['body']['controls']['riskDetails'];
  }

  addMoreService() {
    const detail = this.detailsControl as FormArray;
    detail.push(
      this.fb.group({
        value: new FormControl(null, [RxwebValidators.unique({message:"Datapoint already selected"}), Validators.required]),
        score: new FormControl(null, Validators.required),
      })
    );
    console.log(detail);
  }

  arrayControls(index: any, data: any, operation: any): any {
    return this.detailsControl.controls[index].controls[data][operation]
  }

  removeService(index: any) {
    this.detailsControl.removeAt(index)
    this.detailsControl.value.forEach((element, i) => {
      this.detailsControl.controls[i].patchValue({sortOrder: i})
    })
    const element = document.getElementById('add-more')
    element?.style.setProperty("pointer-events", "auto")
  }

  selectAssessment(data: any) {
    this.riskAssessmentDatapointsDetails.push(data.target.value);
    this.riskAssessmentDetailsDataPoint.controls['request'].value.body.riskAssessmentDatapoints = this.riskAssessmentDatapointsDetails;
  }

  save() {
    this.submitted = true
    if (this.getRiskAssessmentDetailsResponse) {
      this.riskAssessmentDetails.controls['request'].value.body.updatedBy = Number(this.localStorage.getItem('userId'));
      if (this.riskAssessmentDetails.valid) {
        console.log(this.riskAssessmentDetails.value);
        this.service.payInList(this.riskAssessmentDetails.value).subscribe((data: any) => {
          this.submitted = false
          this.AlertMessage = 'Successful'
          this.openPop = true
          this.alertMessage = data.Msg
          this.fontColor = 'green'
        }, error => {
          this.fontColor = 'red'
          this.AlertMessage = 'Warning !!'
          this.openPop = true
          this.alertMessage = error.error?.ERROR || error.error?.Warning || error.error?.Error
        })
      }
    } else {
      if (this.riskAssessmentDetails.valid) {
        this.riskAssessmentDetails.controls['request'].value.body.createdBy = Number(this.localStorage.getItem('userId'));
        console.log(this.riskAssessmentDetails.value);
        this.service.payInList(this.riskAssessmentDetails.value).subscribe((data: any) => {
          this.submitted = false
          this.AlertMessage = 'Successful'
          this.openPop = true
          this.alertMessage = data.Msg
          this.fontColor = 'green'
        }, error => {
          this.fontColor = 'red'
          this.AlertMessage = 'Warning !!'
          this.openPop = true
          this.alertMessage = error.error?.ERROR || error.error?.Warning || error.error?.Error
        })
      }
    }
  }

  closePopup() {
    this.openPop = !this.openPop
    this.router.navigate(['/Configuration/Risk_Assessment'])
  }

  protected readonly RxwebValidators = RxwebValidators;
}
