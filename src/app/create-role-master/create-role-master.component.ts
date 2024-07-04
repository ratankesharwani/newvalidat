import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { PopupboxConfirmationComponent } from '../popupbox-confirmation/popupbox-confirmation.component';

@Component({
  selector: 'app-create-role-master',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterLink,MatTooltip,PopupboxConfirmationComponent],
  templateUrl: './create-role-master.component.html',
  styleUrl: './create-role-master.component.css'
})
export class CreateRoleMasterComponent {
  company: FormGroup;
  companyResponse: any;
  addRoleMaster: FormGroup;
  addRoleMasterResponse: any;
  roleNameValue: any;
  remarkValue: any;
  companyId: any;
  queueParseData: any
  alertMessage = '';
  openPop: boolean = false
  AlertMessage = ''
  fontColor = 'green'
  controls: any
  submitted: boolean = false
  constructor(private service: AdminService,
    private router: Router,
    private localStorage: LocalStorageService) {
    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)

    // Company DropDown
    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });

    // Add role master
    this.addRoleMaster = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', Validators.required),
        subModule: new FormControl('CREATE_ROLE_MASTER', Validators.required),
        body: new FormGroup({
          roleName: new FormControl(null, Validators.required),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          status: new FormControl(false),
          createdBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          remark: new FormControl(),
        })
      })
    });
  }

  ngOnInit() {
    this.service.menuPanel(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })
  }

  // Getting value of role name
  roleName(data: any) {
    this.roleNameValue = data.target.value;
    // this.addRoleMaster.controls['request'].value.body.roleName = this.roleNameValue;
  }

  // Getting value of remark.
  remark(data: any) {
    this.remarkValue = data.target.value;
    this.addRoleMaster.controls['request'].value.body.remark = this.remarkValue;
  }

  // Setting status value
  status(data: any) {
    this.addRoleMaster.controls['request'].value.body.status = data.target.checked;
  }

  // Saving Api
  save() {
    this.submitted = true;
    if (this.addRoleMaster.valid) {
      this.service.menuPanel(this.addRoleMaster.value).subscribe(response => {
        this.openPop = true
        this.AlertMessage = 'Success ..'
        this.addRoleMasterResponse = response;
        this.alertMessage = response.MSG
        // alert(response.MSG)
      }, error => {
        this.openPop = true
        this.AlertMessage = 'Warning !!'
        this.fontColor = 'red'
        this.alertMessage = error.error.ERROR;
        // alert(error.error.ERROR)
      })
    }
  }

  // Control of Add role master --> Role Name
  get roleNameControl() {
    return this.addRoleMaster['controls']['request']['controls']['body']['controls']['roleName'];
  }

  // Control of Add role master --> CompanyId.
  get companyControl() {
    return this.addRoleMaster['controls']['request']['controls']['body']['controls']['companyId'];
  }
  closePopup() {
    this.openPop = false
    if (this.addRoleMaster.valid) {
      this.router.navigate(['/User_Permission/Role_Master'])
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
}

