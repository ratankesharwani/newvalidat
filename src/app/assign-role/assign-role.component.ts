import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { RouterLink } from '@angular/router';
import { PopupboxConfirmationComponent } from '../popupbox-confirmation/popupbox-confirmation.component';

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RouterLink,PopupboxConfirmationComponent],
  templateUrl: './assign-role.component.html',
  styleUrl: './assign-role.component.css'
})
export class AssignRoleComponent {
  company: FormGroup;
  companyResponse: any;

  roles : any;

  logIn: FormGroup;
  logInResponse: any;

  logInUserType: FormGroup;
  roleDetails: FormGroup;
  roleDetailsResponse: any;
  allUser: FormGroup;
  allUserResponse: any;
  updateRole : FormGroup;
  updateRoleResponse : any;
  updateRoleData : any[] = [];
  listUserRole : FormGroup;
  listUserRoleResponse : any;
  roleMaster: FormGroup;
  roleMasterResponse: any;
  saveValue : String = ' Save'
  companyHidden : boolean = true;
  companyId: any;
  userId: any;
  logInUserId: any;
  selected: any[] = [];
  haveRoles : any;
  isDisable: boolean = true;
  queueParseData: any;
  userType: any;
  allUserResponseResult: any;
  displayStyle = 'none'
  openPop: boolean = false
  AlertMessage = ''
  fontColor = 'green'
  alertMessage:any
  controls: any
  submitted: boolean = false
  pushData:any[]=[]
  allRoleDetailsId: any[] = [];
  statusValue : boolean;
  hideRoles : boolean = true;

  constructor(private service: AdminService,private localStorage:LocalStorageService) {

    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)
    // console.log(this.queueParseData);

    this.userType = this.queueParseData?.USER_TYPE;
    this.logInUserId = this.localStorage.getItem('userId');

    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });

    this.allUser = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('LIST_ALL_USERS_ROLE_COMPANY'),
        body: new FormGroup({
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
        })
      })
    });

    this.updateRole = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_ROLE_DETAILS'),
        body: new FormGroup({
          userId: new FormControl(),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          status: new FormControl(false),
          createdBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          masterIdList: new FormControl(),
          updatedBy: new FormControl(Number(this.localStorage.getItem('userId'))),
        })
      })

    });

    this.listUserRole = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('LIST_USER_ROLES'),
        body: new FormGroup({
          userId: new FormControl(),
        })
      })
    });


    // Calling api User list for user dropdown and getting the value of first name and last name.
    this.logInUserType = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('USERS_LIST'),
        body: new FormGroup({
          // companyId: new FormControl(localStorage.getItem('companyId')),
          // id: new FormControl(this.queueParseData.userId),
          userType: new FormControl()
        })
      })
    });

    this.logIn = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('USERS_LIST'),
        body: new FormGroup({
          companyId: new FormControl(),
          id: new FormControl(this.localStorage.getItem('userId')),
          // userType : new FormControl(this.queueParseData.USER_TYPE)
        })
      })
    });

    // Api for company dropdown
    this.roleMaster = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ROLE_MASTER_BY_COMPANY_ID'),
        body: new FormGroup({
          companyId: new FormControl(this.queueParseData?.COMPANY_ID)
        })
      })
    });

    // Api for Asigning the role
    this.roleDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('CREATE_ROLE_DETAILS'),
        body: new FormGroup({
          userId: new FormControl(),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          status: new FormControl(),
          createdBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          masterIdList: new FormControl(),
        })
      })
    });
  }

  ngOnInit() {


    // // For company dropdown
    // if(this.queueParseData.USER_TYPE === "SYSTEM_ADMIN") {
    //   this.companyHidden = false;
    //   this.service.payInList(this.company.value).subscribe(response => {
    //     this.companyResponse = response;
    //   }, error => {
    //     console.log(error);
    //   })
    // }

    // if (this.queueParseData.USER_TYPE) {
    //   this.logInUserType.controls['request'].value.body.userType = this.userType;
    //   this.service.menuPanel(this.logInUserType.value).subscribe(response => {
    //     this.logInResponse = response;
    //   }, error => {
    //     console.log(error);
    //   })
    // }

    if(this.queueParseData?.USER_ID) {
      this.logIn.controls['request'].value.body.userId = this.logInUserId;
      this.logIn.controls['request'].value.body.companyId = this.queueParseData?.COMPANY_ID;
      this.service.menuPanel(this.logIn.value).subscribe((response:any) => {
        this.logInResponse = response;
      }, error => {
        console.log(error);
      })
    }

    this.service.menuPanel(this.roleMaster.value).subscribe((response:any) => {
      this.roleMasterResponse = response;
      for (let i = 0; i < this.roleMasterResponse.length; i++) {
        this.allRoleDetailsId.push(this.roleMasterResponse[i].id);
      }
    }, error => {
      console.log(error);
    })

    this.service.menuPanel(this.allUser.value).subscribe((response:any) => {
      this.allUserResponse = response;
      for (let i = 0; i < this.allUserResponse.length; i++) {
        this.allUserResponseResult = this.allUserResponse[i].RESULT;
      }
    }, error => {
      console.log(error);
    })
  }

  // Getting value of userId and setting the user in role detail.
  userName(data: any): void {
    this.hideRoles = false;
    this.roleDetails.controls['request'].value.body.status = false;
    this.updateRole.controls['request'].value.body.status = false;
    this.updateRoleData.splice(0);
    this.selected.splice(0)
    this.isDisable = false;
    const i: number = data.target["selectedIndex"] - 1;
    if (i != -1) {
      this.userId = this.logInResponse[i].id;
      this.roleDetails.controls['request'].value.body.userId = this.userId;
      this.listUserRole.controls['request'].value.body.userId = this.userId;
      this.updateRole.controls['request'].value.body.userId = this.userId;
      this.service.menuPanel(this.listUserRole.value).subscribe((response:any) => {
        this.listUserRoleResponse = response;
        if(this.listUserRoleResponse.status === true){
          this.statusValue = true;
          this.roleDetails.controls['request'].value.body.status = true;
          this.updateRole.controls['request'].value.body.status = true;
        }
        this.haveRoles = this.listUserRoleResponse.haveRoles;
        for(let i = 0;  i<this.listUserRoleResponse.haveRoles.length;  i++){
          this.roleMasterResponse?.forEach((data,index)=>{
            if(data.name===this.haveRoles[i]){
              this.saveValue = 'Update';
              this.selected[index]=true
              this.updateRoleData.push(this.roleMasterResponse[index].id);
              this.updateRole.controls['request'].value.body.masterIdList=this.updateRoleData
            }
          })
        }
      }, error => {
        this.selected?.forEach((value,index)=>{
          this.selected[index]=false

        })
        this.roles = error.error.ERROR;
        this.saveValue = 'Save'

      })
    }

  }

  // Hitting Role Details Api
  save() {
    if(this.roles != null) {
      this.service.menuPanel(this.roleDetails.value).subscribe((response:any) => {
        this.roleDetailsResponse = response;
        this.alertMessage = response.MSG
        this.openPop=true
        this.AlertMessage='Success ..'
        this.roleDetails.patchValue({
          userId: new FormControl(null),
          status: new FormControl(null),
          masterIdList: new FormControl(null),
        });
      }, error => {
        this.openPop=true
        this.fontColor='red'
        this.AlertMessage='Warning !!'
        this.alertMessage = error.error.ERROR;
      })
    }

    else{
      this.updateRole.controls['request'].value.body.masterIdList = this.updateRoleData
      this.service.menuPanel(this.updateRole.value).subscribe((response:any) => {
        this.updateRoleResponse = response;
        this.alertMessage = response.MSG
        this.openPop=true
        this.AlertMessage='Success ..'
        this.roleDetails.patchValue({
          userId: new FormControl(null),
          status: new FormControl(null),
          masterIdList: new FormControl(null),
        });
      }, error => {
        this.openPop=true
        this.fontColor='red'
        this.AlertMessage='Warning !!'
        this.alertMessage = error.error.ERROR;
      })
    }
  }

  // Selecting roles for sending values to Role Details
  selectRoleName(data:any,i,id:any) {
    if (data.target.checked) {
      this.pushData.push(id)
      this.updateRoleData.push(id)
      this.roleDetails.controls['request'].value.body.masterIdList=this.pushData
      this.updateRole.controls['request'].value.body.masterIdList=this.updateRoleData
    } else {
      const Array = this.roleDetails.controls['request'].value.body.masterIdList
     if(Array!=null){
       Array?.forEach((value,index)=>{
         if(value==id){
           Array.splice(index,1)
           this.roleDetails.controls['request'].value.body.masterIdList = Array
         }
       })
     }
      const UpdatedArray = this.updateRoleData
     if(UpdatedArray!=null){
       UpdatedArray?.forEach((value,index)=>{
         if(value==id){
           UpdatedArray.splice(index,1)
           this.updateRole.controls['request'].value.body.masterIdList = UpdatedArray
         }
       })
     }
    }
  }

  element = document.getElementById("is3dCheckBox") as HTMLInputElement;

  // Click them status value turns true
  status(data:any) {
    this.roleDetails.controls['request'].value.body.status = data.target.checked;
    this.updateRole.controls['request'].value.body.status = data.target.checked;
  }

  // Getting Control of role Details masterIdList Field.
  get masterIdListControl() {
    return this.roleDetails['controls']['request']['controls']['body']['controls']['masterIdList'];
  }

  // Select all check box in one click.
  selectAll(data: any) {
    this.updateRole.controls['request'].value.body.masterIdList.splice(0);
    if (data.target.checked) {
      for (let i = 0; i < this.roleMasterResponse.length; i++) {
        this.selected[i] = true;
      }
      this.roleDetails.controls['request'].value.body.masterIdList = this.allRoleDetailsId;
      const UpdatedArray = this.updateRoleData
      this.allRoleDetailsId?.forEach((data:any)=>{
        if(this.updateRoleData!=data){
         UpdatedArray.push(data)
          this.updateRole.controls['request'].value.body.masterIdList = UpdatedArray
        }
      })
    }
    else {
      for (let i = 0; i < this.roleMasterResponse.length; i++) {
        this.selected[i] = false;
      }
      this.roleDetails.controls['request'].value.body.masterIdList = [];
      this.updateRole.controls['request'].value.body.masterIdList = [];
    }
  }

  companyValue(data:any){
    for(let i = 0;  i<this.companyResponse.length;  i++){
      if(this.companyResponse[i].value === data.target.value){
        this.companyId = this.companyResponse[i].key;
        this.roleDetails.controls['request'].value.body.companyId = this.companyResponse[i].key;
      }
    }
  }

  closePopup() {
    this.openPop=false
    window.location.reload();
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
  insertionSort(array: any[]): void {
    for(let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current?.sortOrder < array[j]?.sortOrder && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }
}

