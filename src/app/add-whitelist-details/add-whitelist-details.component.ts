import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-whitelist-details',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './add-whitelist-details.component.html',
  styleUrl: './add-whitelist-details.component.css'
})
export class AddWhitelistDetailsComponent {
  addWhitelistDetails: FormGroup;
  currencyDropDown: FormGroup;
  debtorCountryDropdown: FormGroup;
  senderTypeForm:FormGroup;
  debtorCountryDropdownResponse : any;
  currencyDropDownResponse : any;
  addWhitelistDetailsResponse: any;
  queueParseData: any;
  submitted: boolean = false;
  openPop: boolean = false
  AlertMessage = ''
  displayStyle = 'none';
  alertMessage = ''
  fontColor = ''
  senderType:any

  constructor(private service: AdminService,
              private router: Router,
            private localStorage:LocalStorageService) {
    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData);
    this.addWhitelistDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('WHITELIST_DETAILS_CREATE'),
        body: new FormGroup({
          accountNumber: new FormControl(null, Validators.required),
          debtorName: new FormControl(null, Validators.required),
          currencyCode: new FormControl(null, Validators.required),
          bankName: new FormControl(null, Validators.required),
          debtorCountry: new FormControl(null),
          clientId: new FormControl(null, Validators.required),
          status: new FormControl(false),
          createdBy: new FormControl(this.queueParseData?.USER_ID),
          description: new FormControl(),
          senderType:new FormControl(null, Validators.required)
        })
      })
    });

    this.currencyDropDown = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('CURRENCY_DROP_DOWN'),
      })
    });

    this.debtorCountryDropdown = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COUNTRY_DROP_DOWN'),
      })
    });
    this.senderTypeForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN', [Validators.required]),
        body: new FormGroup({
          sysLookupName: new FormControl('SenderType', [Validators.required])
        })
      })
    });
  }

  ngOnInit() {
    this.senderTypeDropdown()
    this.service.serviceDetails(this.currencyDropDown.value).subscribe(response => {
      this.currencyDropDownResponse = response;
      this.insertionSort(this.currencyDropDownResponse)
      }, error => {
      console.log(error);
    })
    this.service.serviceDetails(this.debtorCountryDropdown.value).subscribe(response => {
      this.debtorCountryDropdownResponse = response;
      this.insertionSort(this.debtorCountryDropdownResponse);
    }, error => {
      console.log(error);
    })
  }
  senderTypeDropdown() {
    this.service.payInList(this.senderTypeForm.value).subscribe((data: any) => {
      this.senderType = data
    })
  }

  get controls() {
    return this.addWhitelistDetails['controls']['request']['controls']['body']['controls']
  }

  status(data: any) {
    this.addWhitelistDetails.controls['request'].value.body.status = data.target.checked;
  }

  // currency(){
  //   console.log(this.addWhitelistDetails.value);
  // }

  save() {
    this.submitted = true;
    if (this.addWhitelistDetails.valid) {
      this.service.serviceDetails(this.addWhitelistDetails.value).subscribe(response => {
        this.addWhitelistDetailsResponse = response;
        this.openPop=true
        this.fontColor='green'
        this.AlertMessage='Successful !!'
        this.alertMessage='Whitelist added'
        this.addWhitelistDetails.reset();
        this.submitted = false;
      }, error => {
        this.fontColor='red'
        this.openPop=true
        this.AlertMessage='Warning !!'
        this.alertMessage=error.error.message;
      })
    }
  }

  debtorCountry(data : any){
    for(let i = 0;  i<this.debtorCountryDropdownResponse.length; i++){
      if(this.debtorCountryDropdownResponse[i].value === data.target.value){
        this.addWhitelistDetails.controls['request'].value.body.debtorCountry = this.debtorCountryDropdownResponse[i].key;

      }
    }
  }

  closePopup() {
    this.openPop = false
    this.router.navigate(["/Configuration/Add_Whitelist_Details"])
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
  insertionSort(array: any[]): void {
    for(let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current?.value < array[j]?.value && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }
}

