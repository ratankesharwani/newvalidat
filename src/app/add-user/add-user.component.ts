import { Component, HostListener } from '@angular/core';
import { UserDetailsAddComponent } from "../user-details-add/user-details-add.component";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';

@Component({
    selector: 'app-add-user',
    standalone: true,
    templateUrl: './add-user.component.html',
    styleUrl: './add-user.component.css',
    imports: [UserDetailsAddComponent,FormsModule,ReactiveFormsModule,RouterLink,CommonModule]
})
export class AddUserComponent {
  company: FormGroup;
  companyResponse: any;
  displayStyle = 'none';
  alertMessage = ''
  queueParseData: any;
  openPop:boolean=false
  AlertMessage=''
  department: FormGroup;
  departmentResponse: any;
  emailChecker: FormGroup;
  emailCheckerValue: any;
  mobileChecker: FormGroup;
  mobileCheckerValue: any;
  createUser: FormGroup;
  companyId: any;
  departmentId: any;
  emailValidation: boolean = false;
  mobileValidation: boolean = false;
  submitted: boolean = false
  companyHidden : boolean = true;
  logInCompanyId : any;
  middleName : any;
  fontColor=''
  constructor(private service: AdminService,
              private router:Router,
            private localStorage:LocalStorageService) {
    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)
    this.logInCompanyId = this.queueParseData?.COMPANY_ID
    this.department = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('GET_DEPARTMENTS'),
        body: new FormGroup({})
      })
    });


    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });

    this.createUser = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('CREATE_USER'),
        body: new FormGroup({
          emailId: new FormControl(null, [Validators.required, Validators.email]),
          status: new FormControl(null, [Validators.required]),
          mobileNo: new FormControl(null, [Validators.required]),
          departmentId: new FormControl(null, [Validators.required]),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          firstName: new FormControl(null, [Validators.required]),
          lastName: new FormControl(null, [Validators.required]),
          middleName: new FormControl(),
          jobTitle: new FormControl(null, [Validators.required])
        })
      })
    });

    this.emailChecker = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('EMAIL_CHECKER'),
        body: new FormGroup({
          emailId: new FormControl()
        })
      })
    });

    this.mobileChecker = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('MOBILE_CHECKER'),
        body: new FormGroup({
          mobileNo: new FormControl()
        })
      })
    });
  }
  ngOnInit() {
    if(this.queueParseData?.USER_TYPE === "System Admin") {
      this.companyHidden = false;
    }
    this.service.payInList(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })
    this.service.payInList(this.department.value).subscribe(response => {
      this.departmentResponse = response;
    }, error => {
      console.log(error);
    })

  }

  statusValue(event: any): void {
    const i: number = event.target["selectedIndex"] - 1;
    if (i != -1) {
      this.createUser.controls['request'].value.body.status = event.target.value
    }
  }
  companyValue(data:any){
  }
  firstNameValue(event: any) {
    this.createUser.controls['request'].value.body.firstName = event.target.value;
  }

  middleNameValue(event: any) {
    this.middleName = event.target.value;
  }

  lastNameValue(event: any) {
    this.createUser.controls['request'].value.body.lastName = event.target.value;
  }

  emailValue(event: any) {

    this.emailChecker.controls['request'].value.body.emailId = event.target.value;
    this.service.login(this.emailChecker.value).subscribe(response => {
      this.emailCheckerValue = response;
      this.emailValidation = false
    }, error => {
      this.emailValidation = true
      this.emailCheckerValue = error.error.ERROR;
    })
    this.createUser.controls['request'].value.body.emailId = event.target.value;
  }

  jobTitleValue(event: any) {
    this.createUser.controls['request'].value.body.jobTitle = event.target.value;
  }

  mobileNumberValue(event: any) {
    this.mobileChecker.controls['request'].value.body.mobileNo = event.target.value;
    this.createUser.controls['request'].value.body.mobileNo = event.target.value;
    this.service.payInList(this.mobileChecker.value).subscribe(response => {
      this.mobileCheckerValue = response;
      this.mobileValidation = false
      // console.log(this.mobileCheckerValue)
    }, error => {
      this.mobileCheckerValue = error.error.ERROR;
      this.mobileValidation = true
      console.log(error.error.ERROR)
    })
  }
  get emailControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['emailId'];
  }
  get firstNameControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['firstName'];
  }

  get lastNameControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['lastName'];
  }

  get companyIdControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['companyId'];
  }

  get departmentIdControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['departmentId'];
  }

  get statusControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['status'];
  }

  get jobTitleControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['jobTitle'];
  }

  get mobileNumberControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['mobileNo'];
  }

  get userControl() {
    return this.createUser['controls']['request']['controls']['body']['controls']['emailId'];
  }

  save() {
    this.createUser.controls['request'].value.body.middleName = this.middleName;
    if(this.companyId != null){
      this.createUser.controls['request'].value.body.companyId = this.companyId;
    }
    this.submitted = true
    if(this.createUser.valid){
      this.service.payInList(this.createUser.value).subscribe((response:any) => {
       this.openPop=true
       this.fontColor='green'
       this.AlertMessage='Successful !!'
       this.alertMessage=response.MSG
       alert(response.MSG)
       this.service.loggedIn = true;
       this.createUser.reset();
       this.submitted = false;
     }, error => {
        this.fontColor='red'
       this.openPop=true
       this.AlertMessage='Warning !!'
       alert(error.error.ERROR)
       this.alertMessage=error.error.ERROR;
     })
   }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  closePopup() {
    this.openPop=false
    if(!this.submitted){
      this.router.navigate(['/Admin/Users'])
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
}

