import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PopupboxComponent } from '../popupbox/popupbox.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,RouterLinkActive,MatTooltip,PopupboxComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  logIn: FormGroup;
  logInResponse: any;
  updateUser: FormGroup;
  alertMessage = ''
  queueParseData: any;
  openPop:boolean=false
  AlertMessage=''
  tabColumns=[
    {
      name:"Email Id",
      key:'emailId',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Department",
      key:'department',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Mobile Number",
      key:'mobileNo',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"First Name",
      key:'firstName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Middle Name",
      key:'middleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Last Name",
      key:'lastName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Job Title",
      key:'jobTitle',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'status',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Action",
      key:'action',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    }
  ]
  constructor(private service: AdminService,
    private router:Router,
    private localStorage:LocalStorageService) {

    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)
    console.log(this.queueParseData,'queueParseData');

    this.logIn = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('USERS_LIST'),
        body: new FormGroup({
          companyId: new FormControl(),
          id: new FormControl(),
        })
      })
    });


    // Updaate User
    this.updateUser = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_USER_STATUS'),
        body: new FormGroup({
          id: new FormControl(),
          status: new FormControl()
        })
      })
    });
  }

  ngOnInit() {
    // console.log(this.router.config)
    if (this.queueParseData && this.queueParseData.COMPANY_ID && this.queueParseData.USER_ID) {
      this.logIn.controls['request'].value.body.companyId = this.queueParseData.COMPANY_ID;
      this.logIn.controls['request'].value.body.userId = this.queueParseData.USER_ID;
      this.service.payInList(this.logIn.value).subscribe((response) => {
        this.logInResponse = response;
      }, err => {
        console.log(err);
      })
    }
    if (this.queueParseData && this.queueParseData.USER_TYPE) {
      this.logIn.controls['request'].value.body.userType = this.queueParseData.USER_TYPE;
      this.service.payInList(this.logIn.value).subscribe((response) => {
        this.logInResponse = response;
      }, err => {
        console.log(err);
      })
    }
  }

  changeStatus(event: any, id: any) {
    this.updateUser.controls['request'].value.body.status = !event;
    this.updateUser.controls['request'].value.body.id = id;
    this.service.payInList(this.updateUser.value).subscribe((data: any) => {
      this.AlertMessage='Successfully'
      this.openPop=true
      this.alertMessage = data.MSG
      this.ngOnInit()
    }, error => {
      this.openPop=true
      this.alertMessage = error.error.ERROR;
    })
  }

  openPopUp(id: any, status: any) {
    this.openPop=true
    this.updateUser.controls['request'].value.body.status = !status;
    this.updateUser.controls['request'].value.body.id = id;
    if(status){
      this.AlertMessage="Are you sure you want to apply 'Inactive' action?"
    }else {
      this.AlertMessage="Are you sure you want to apply 'Active' action?"
    }
  }
  closePopup(event:any) {
    if(event){
      this.service.payInList(this.updateUser.value).subscribe((data: any) => {
        this.ngOnInit()
      }, error => {
        console.log(error)
      })
    }
    this.openPop=false
  }
}
