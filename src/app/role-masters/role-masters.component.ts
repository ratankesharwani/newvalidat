import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExportAsService } from 'ngx-export-as';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-role-masters',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterLink,MatTooltip],
  templateUrl: './role-masters.component.html',
  styleUrl: './role-masters.component.css'
})
export class RoleMastersComponent {
  companyId : any;

  roleMasterGrid : FormGroup;
  roleMasterGridResponse : any;

  updateRoleMasterGrid : FormGroup;
  animation:boolean=true
  display: boolean = false
  statusActive: any
  clickedInside:any

  queueParseData : any;

  roleMasterUserType : FormGroup;
  displayStyle = 'none'
  alertMessage = ''
  openPop:boolean=false
  AlertMessage=''
  fontColor='green'

  tabColumns=[
    {
      name:"Role Name",
      key:'roleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Remark",
      key:'remark',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created Date",
      key:'createdDate',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'middleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Action",
      key:'lastName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    }
  ]

  constructor(private service: AdminService,
              private router: Router,
            private localStorage:LocalStorageService) {
    const queueData:any=this.localStorage.getItem("data")
    this.queueParseData=JSON.parse(queueData)
    this.companyId = localStorage.getItem('companyId');
    this.roleMasterGrid = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ROLE_MASTER_BY_COMPANY_ID'),
        body: new FormGroup({
          companyId: new FormControl()
        })
      })
    });

    this.roleMasterUserType = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('LIST_ROLE_MASTER'),
        body: new FormGroup({
        })
      })
    });

    this.updateRoleMasterGrid = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_ROLE_MASTER_STATUS'),
        body: new FormGroup({
          id: new FormControl(),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          status: new FormControl(),
          updatedBy: new FormControl(this.queueParseData?.USER_ID)
        })
      })
    });
  }

  ngOnInit() {
    if(this.queueParseData && this.queueParseData?.COMPANY_ID !==null) {
      this.roleMasterGrid.controls['request'].value.body.companyId = this.companyId;
      this.service.menuPanel(this.roleMasterGrid.value).subscribe(response => {
        this.roleMasterGridResponse = response;
      }, error => {
        console.log(error)
      })
    }

    if(this.queueParseData?.USER_TYPE != null)
    this.service.menuPanel(this.roleMasterUserType.value).subscribe(response=>{
      this.roleMasterGridResponse = response;
    },error=>{
      console.log(error)
    })
  }

  // changeStatus(event: any, id: any) {
  //   this.updateRoleMasterGrid.controls['request'].value.body.status = !event;
  //   this.updateRoleMasterGrid.controls['request'].value.body.id = id;
  //   this.service.payInList(this.updateRoleMasterGrid.value).subscribe((data: any) => {
  //     this.openPop=true
  //     this.alertMessage = data.MSG
  //     this.AlertMessage='Successful !!'
  //     this.ngOnInit()
  //   }, error => {
  //     this.openPop=true
  //     this.AlertMessage='Successful !!'
  //     this.alertMessage = error.error.ERROR;
  //     this.fontColor='red'
  //   })
  // }
  closePopup(event:any) {
    if(event){
      this.service.payInList(this.updateRoleMasterGrid.value).subscribe((data: any) => {
        this.ngOnInit()
      }, error => {
        console.log(error)
      })
    }
    this.openPop=false
  }
  openPopUp(id: any, status: any) {
    this.openPop=true
    this.updateRoleMasterGrid.controls['request'].value.body.status = !status;
    this.updateRoleMasterGrid.controls['request'].value.body.id = id;
    if(status){
      this.AlertMessage="Are you sure you want to apply 'Inactive' action?"
    }else {
      this.AlertMessage="Are you sure you want to apply 'Active' action?"
    }
  }
  }
