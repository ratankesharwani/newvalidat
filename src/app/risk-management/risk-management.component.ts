import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { PopupboxComponent } from '../popupbox/popupbox.component';
import { PopupboxConfirmationComponent } from '../popupbox-confirmation/popupbox-confirmation.component';

@Component({
  selector: 'app-risk-management',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterLink,MatTooltip,PopupboxComponent,PopupboxConfirmationComponent],
  templateUrl: './risk-management.component.html',
  styleUrl: './risk-management.component.css'
})
export class RiskManagementComponent {
  module: FormGroup;
  company: FormGroup;
  dataPoint: FormGroup;
  riskAssessmentList: FormGroup;
  riskAssessmentCreation: FormGroup;
  updateRiskAssessment: FormGroup;

  moduleResponse: any;
  companyResponse: any;
  dataPointResponse: any;
  controls: any;
  routeData: any
  submitted: boolean = false;
  dataPointValidation: any;
  openPop: boolean = false
  openPopWithAction: boolean = false
  AlertMessage = '';
  fontColor = 'green';
  displayStyle = "none";
  alertMessage = '';
  riskAssessmentCreationResponse: any;
  riskAssessmentListResponse: any;
  tabColumns=[
    {
      name:"Name",
      key:'moduleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Data Point Name",
      key:'companyName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created Date",
      key:'columnName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Description",
      key:'blacklistType',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'blacklistValue',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
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
              private router: Router,
              private localStorage:LocalStorageService) {
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

    this.dataPoint = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_DATAPOINTS'),
        body: new FormGroup({
          moduleId: new FormControl(null),
          companyId: new FormControl(null)
        })
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

    this.updateRiskAssessment = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_RISK_ASSESSMENT_MASTER'),
        body: new FormGroup({
          masterId: new FormControl(null),
          status: new FormControl(null),
          updatedBy: new FormControl(Number(this.localStorage.getItem("userId"))),
        })
      })
    });

    this.riskAssessmentCreation = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('RISK_ASSESSMENT_MASTER_CREATION'),
        body: new FormGroup({
          moduleId: new FormControl(null, Validators.required),
          companyId: new FormControl(null, Validators.required),
          dataPointId: new FormControl(null, Validators.required),
          createdBy: new FormControl(Number(this.localStorage.getItem("userId"))),
          status: new FormControl(false),
          name: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required),
        })
      })
    });
  }

  ngOnInit() {
    this.controls = this.riskAssessmentCreation['controls']['request']['controls']['body']['controls']
    this.service.payInList(this.module.value).subscribe((response: any) => {
      this.moduleResponse = response;
    }, error => {
      console.log(error);
    })

    this.service.payInList(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })
  }

  getModule(data: any) {
    if (this.dataPoint.controls['request'].value.body.moduleId != null || this.dataPoint.controls['request'].value.body.companyId != null) {
      if (this.dataPoint.controls['request'].value.body.moduleId != null) {
        this.dataPointValidation = true;
      }
      this.dataPoint.controls['request'].value.body.moduleId = data;
      this.riskAssessmentList.controls['request'].value.body.moduleId = data;
      this.service.payInList(this.dataPoint.value).subscribe(response => {
        this.dataPointResponse = response;
      }, error => {
        console.log(error);
      })
      this.service.payInList(this.riskAssessmentList.value).subscribe(response => {
        this.riskAssessmentListResponse = response;
      }, error => {
        console.log(error);
      })
    }
    if (this.riskAssessmentCreation.controls['request'].value.body.dataPointId == null) {
      this.dataPointValidation = false;
    }
    this.riskAssessmentCreation.controls['request'].value.body.moduleId = data;
    this.dataPoint.controls['request'].value.body.moduleId = data;
    this.riskAssessmentList.controls['request'].value.body.moduleId = data;
  }


  companyDropdown(data: any) {
    if (this.dataPoint.controls['request'].value.body.companyId != null) {
      this.riskAssessmentCreation.controls['request'].value.body.dataPointId = null;
      this.dataPointValidation = true;
    } else {
      if (this.riskAssessmentCreation.controls['request'].value.body.dataPointId == null) {
        this.dataPointValidation = false;
      }
      this.dataPoint.controls['request'].value.body.companyId = data;
      this.riskAssessmentList.controls['request'].value.body.companyId = data;
      this.service.payInList(this.dataPoint.value).subscribe(response => {
        this.dataPointResponse = response;
      }, error => {
        console.log(error);
      })
      this.service.payInList(this.riskAssessmentList.value).subscribe(response => {
        this.riskAssessmentListResponse = response;
      }, error => {
        console.log(error);
      })
    }
  }

  dataPointValue(data: any) {
    if (this.dataPoint.controls['request'].value.body.moduleId != null) {
      this.dataPointValidation = false;
    }
  }


  openPopUp(id: any, status: any) {
    this.openPopWithAction = true
    if (this.riskAssessmentCreationResponse) {

    }
    this.updateRiskAssessment.controls['request'].value.body.status = !status;
    this.updateRiskAssessment.controls['request'].value.body.masterId = id;
    if (status) {
      this.AlertMessage = "Are you sure you want to apply 'Inactive' action?"
    } else {
      this.AlertMessage = "Are you sure you want to apply 'Active' action?"
    }
  }

  closePopup(event: any) {
    if (event) {
      this.service.payInList(this.updateRiskAssessment.value).subscribe((data: any) => {
        this.service.payInList(this.riskAssessmentList.value).subscribe(response => {
          this.riskAssessmentListResponse = response;
        }, error => {
          console.log(error);
        })
      }, error => {
        console.log(error)
      })
    }
    this.openPopWithAction = false
    this.openPop = false
  }

  save() {
    this.submitted = true;
    if (this.riskAssessmentCreation.valid && this.riskAssessmentCreation.controls['request'].value.body.dataPointId != null) {
      this.service.payInList(this.riskAssessmentCreation.value).subscribe(response => {
        this.riskAssessmentCreationResponse = response;
        this.submitted = false
        this.fontColor = 'green'
        this.openPop = true
        this.AlertMessage = 'Successful !!'
        this.alertMessage = this.riskAssessmentCreationResponse.Msg;
      }, error => {
        console.log(error);
        this.openPop = true
        this.AlertMessage = 'Warning !!'
        this.fontColor = 'red'
        this.alertMessage = error.error.Error;
      })
    }
  }

  riskAssessmentDetails(data: any, i) {
    this.router.navigate(
      ['/Configuration/Risk_Assessment_Details'],
      {
        queryParams: {
          id: this.riskAssessmentListResponse[i].id,
          name: this.riskAssessmentListResponse[i].name,
          description: this.riskAssessmentListResponse[i].description,
          dataPoint: this.riskAssessmentListResponse[i].datapoint,
          status: this.riskAssessmentListResponse[i].status,
          moduleId : this.riskAssessmentList.controls['request'].value.body.moduleId ,
          companyId : this.riskAssessmentList.controls['request'].value.body.companyId ,
        }
      }
    );
  }

  closePopup1() {
    this.openPop = false
  }
}
