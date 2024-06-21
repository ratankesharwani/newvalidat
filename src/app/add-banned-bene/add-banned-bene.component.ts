import { Component, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-banned-bene',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './add-banned-bene.component.html',
  styleUrl: './add-banned-bene.component.css'
})
export class AddBannedBeneComponent {


  addBannedBene: FormGroup;
  company: FormGroup;
  moduleForm: FormGroup;
  currency: FormGroup;
  country: FormGroup;
  submitted: boolean = false;
  currencyResponse: any;
  countryResponse: any;
  moduleFormResponse: any;
  companyResponse: any;
  queueParseData: any;
  openPop: boolean = false
  AlertMessage = ''
  displayStyle = 'none';
  alertMessage = ''
  fontColor = ''
  addBannedBeneResponse: any;
  accountType: FormGroup;
  accountTypeResponse : any;
  error : any;

  constructor(private active: ActivatedRoute,
              private service: AdminService,
              private elementRef: ElementRef,
              private router: Router) {
    const queueData: any = localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData);
    this.addBannedBene = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ADD_NEW_BANNED_BENE'),
        body: new FormGroup({
          moduleId: new FormControl(null, Validators.required),
          companyId: new FormControl(null, Validators.required),
          currencyCode: new FormControl(null, Validators.required),
          country: new FormControl(null, Validators.required),
          entityType: new FormControl(null),
          field: new FormControl(null, Validators.required),
          code: new FormControl(null, Validators.required),
          status: new FormControl(false),
          name: new FormControl(null, Validators.required),
          userId: new FormControl(this.queueParseData.USER_ID)
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

    this.currency = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('CURRENCY_DROP_DOWN'),
        body: new FormGroup({
        })
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

    this.country = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COUNTRY_DROPDOWN'),
        body: new FormGroup({
        })
      })
    });

    this.accountType = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN'),
        body: new FormGroup({
          sysLookupName: new FormControl('Bank Account No Type')
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

    this.service.payInList(this.currency.value).subscribe(response => {
      this.currencyResponse = response;
    }, error => {
    })

    this.service.payInList(this.country.value).subscribe(response => {
      this.countryResponse = response;
    }, error => {
    })

    this.service.payInList(this.accountType.value).subscribe(response => {
      this.accountTypeResponse = response;
    }, error => {
    })
  }

  get controls() {
    return this.addBannedBene['controls']['request']['controls']['body']['controls']
  }

  moduleName: any;

  save() {
    if (this.addBannedBene.controls['request'].value.body.moduleId === 11) {
      this.addBannedBene.controls['request'].value.body.entityType = "Customer";

    }
    if (this.addBannedBene.controls['request'].value.body.moduleId === 12) {
      this.addBannedBene.controls['request'].value.body.entityType = "Beneficiary";
    }
    this.submitted = true;
    if (this.addBannedBene.valid) {
      this.service.payInList(this.addBannedBene.value).subscribe(response => {
        this.addBannedBeneResponse = response;
        this.openPop = true
        this.fontColor = 'green'
        this.AlertMessage = 'Successful !!'
        this.alertMessage = this.addBannedBeneResponse.MSG;
        this.addBannedBene.reset();
        this.submitted = false;
      }, error => {
        console.log(error);
        this.fontColor = 'red'
        this.openPop = true
        this.AlertMessage = 'Warning !!'
        this.error = error.error.Error;
        this.alertMessage = this.error;
      })
    }
  }

  closePopup() {
    this.openPop = false;
    if(!this.error){
      this.router.navigate(["/Configuration/Banned_Bene"])
    }
    this.error = null;
  }

  keyPressAlphaNumeric(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  goBack(){
    this.router.navigate(['Configuration/Banned_Bene'])
  }
}
