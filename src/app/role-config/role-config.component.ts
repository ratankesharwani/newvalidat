import { Component, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { PopupboxConfirmationComponent } from '../popupbox-confirmation/popupbox-confirmation.component';

@Component({
  selector: 'app-role-config',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,PopupboxConfirmationComponent],
  templateUrl: './role-config.component.html',
  styleUrl: './role-config.component.css'
})
export class RoleConfigComponent {
  company: FormGroup;
  companyResponse: any;
  displayStyle = 'none';
  alertMessage = '';
  openPop: boolean = false
  AlertMessage = ''
  fontColor = ''
  roleMasterGrid: FormGroup;
  roleMasterGridResponse: any;
  menuPanel: FormGroup;
  menuPanelResponse: any;
  roleConfigs: FormGroup;
  roleConfigsResponse: any;
  getRoleConfig: FormGroup;
  getRoleConfigResponse: any;
  updateRoleConfig: FormGroup;
  updateRoleConfigResponse: any;
  saveValue = 'Save';
  roleId: any;
  display: any;
  selectedMenu: any[] = []
  subMenu: any;
  index: any;
  selectedIndex: any = 0
  menusId: any[] = [];
  moduleIds: any[] = [];
  moduleIdResponse: any[] = [];
  disableRoles: boolean = true;
  companyId: any;
  queueParseData: any;
  moduleId: any;
  checked: any
  modId: any [] = [];

  constructor(private service: AdminService,
              private router: Router,
              private fb: FormBuilder,
              private localStorage: LocalStorageService) {
    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)
    this.company = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('COMPANY_MASTER_DROPDOWN'),
        body: new FormGroup({})
      })
    });

    this.roleMasterGrid = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ROLE_MASTER_BY_COMPANY_ID'),
        body: new FormGroup({
          companyId: new FormControl(this.queueParseData?.COMPANY_ID)
        })
      })
    });

    this.getRoleConfig = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('GET_ROLE_CONFIGURATION'),
        body: new FormGroup({
          masterId: new FormControl()
        })
      })
    });

    this.updateRoleConfig = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('UPDATE_ROLE_CONFIGURATION'),
        body: new FormGroup({
          masterId: new FormControl(),
          roleConfiguration: new FormArray([])
        })
      })
    });

    this.menuPanel = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('MENU_PANEL'),
        body: new FormGroup({})
      })
    });

    this.roleConfigs = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ROLE_CONFIGURATION'),
        body: new FormGroup({
          roleConfiguration: new FormArray([])
        })
      })
    });
  }

  funcForIndex() {
    this.selectedMenu.splice(0)
    for (let i = 0; i < this.menuPanelResponse.length; i++) {
      this.moduleIdResponse.push(this.menuPanelResponse[i].id);
      this.selectedMenu.push([])
      for (let j = 0; j < this.menuPanelResponse[i].subMenu.length; j++) {
        this.selectedMenu[i].push(false)
      }
    }
  }

  ngOnInit() {

    this.service.menuPanel(this.menuPanel.value).subscribe(response => {
      this.menuPanelResponse = response.menu;
      this.clickModule(0)
      this.menuPanelResponse.forEach((data) => {
        this.modId.push(data.id);
      })
      this.funcForIndex()
    }, error => {
      console.log(error);
    })

    this.service.menuPanel(this.company.value).subscribe(response => {
      this.companyResponse = response;
    }, error => {
      console.log(error);
    })

    if (this.queueParseData && this.queueParseData.COMPANY_ID) {
      // this.roleMasterGrid.controls['request'].value.body.companyId = this.queueParseData.COMPANY_ID;
      this.service.menuPanel(this.roleMasterGrid.value).subscribe(response => {
        this.roleMasterGridResponse = response;
        this.insertionSort(this.roleMasterGridResponse)
      }, error => {
        console.log(error)
      })
    }
  }


  // clickSubMenu(data: any, event : any) {
  //   console.log(this.selectedMenu)
  //   console.log(data);
  //   console.log(this.checked)
  //   console.log(event.target.checked);
  // }
  get configsControl() {
    return this.roleConfigs['controls']['request']['controls']['body']['controls']['roleConfiguration'];
  }

  get updateConfigsControl() {
    return this.updateRoleConfig['controls']['request']['controls']['body']['controls']['roleConfiguration'];
  }

  addMoreConfigs(menuId: any, event: any, index: any) {
    if (event.target.checked) {
      const detail = this.configsControl as FormArray;
      detail.push(
        this.fb.group({
          roleMasterId: new FormControl(this.roleId),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          createdBy: new FormControl(this.queueParseData.USER_ID),
          menuId: new FormControl(menuId),
          moduleId: new FormControl(this.moduleIdValue),
        })
      );
      // console.log(this.configsControl.value)
      const updated = this.updateConfigsControl as FormArray;
      updated.push(
        this.fb.group({
          roleMasterId: new FormControl(this.roleId),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          createdBy: new FormControl(this.queueParseData.USER_ID),
          menuId: new FormControl(menuId),
          moduleId: new FormControl(this.moduleIdValue),
          updatedBy: new FormControl(this.queueParseData.USER_ID)
        })
      );
      // console.log(this.updateConfigsControl.value)
    } else {
      this.selectedMenu[this.selectedIndex][index] = false
      this.configsControl.removeAt(this.configsControl.value.findIndex(MenuId =>
        MenuId.menuId === menuId
      ))
      this.updateConfigsControl.removeAt(this.updateConfigsControl.value.findIndex(MenuId =>
        MenuId.menuId === menuId
      ))
      // console.log(this.configsControl.value)
      // console.log(this.updateRoleConfig.value)
    }
  }

  insertionSort(array: any[]): void {
    for (let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current?.name < array[j]?.name && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }

  save() {
    // console.log(this.getRoleConfigResponse);
    // console.log(this.roleConfigs.value);
    if (this.getRoleConfigResponse === null) {
      this.service.menuPanel(this.roleConfigs.value).subscribe(response => {
        this.roleConfigsResponse = response;
        this.openPop = true
        this.AlertMessage = 'Successful'
        this.fontColor = 'green'
        this.alertMessage = this.roleConfigsResponse.MSG;
        // this.displayStyle = 'block'
      }, error => {
        console.log(error)
        this.openPop = true
        this.AlertMessage = 'Warning !!'
        this.fontColor = 'red'
        this.alertMessage = error.error.ERROR;
      })
    } else {
      // console.log("inside else")
      this.updateRoleConfig.controls['request'].value.body.masterId = this.roleId;
      this.service.menuPanel(this.updateRoleConfig.value).subscribe(response => {
        this.updateRoleConfigResponse = response;
        this.openPop = true
        this.AlertMessage = 'Successful'
        this.fontColor = 'green'
        this.alertMessage = this.updateRoleConfigResponse.MSG;
        // console.log(response)
      }, error => {
        console.log(error)
        this.openPop = true
        this.AlertMessage = 'Warning !!'
        this.fontColor = 'red'
        this.alertMessage = error.error.ERROR;
      })
    }
  }

  rolesValue(data: any) {
    this.funcForIndex()
    const detail = this.updateConfigsControl as FormArray;
    detail.clear()
    this.disableRoles = false;
    // console.log(data.target.value);
    for (let i = 0; i < this.roleMasterGridResponse.length; i++) {
      if (data.target.value === this.roleMasterGridResponse[i].name) {
        this.roleId = this.roleMasterGridResponse[i].id;
      }
    }

    this.getRoleConfig.controls['request'].value.body.masterId = this.roleId;
    this.service.menuPanel(this.getRoleConfig.value).subscribe(response => {
      this.getRoleConfigResponse = response;
      console.log(this.getRoleConfigResponse,'getRoleConfigResponse');

      this.saveValue = 'Save';
      this.getRoleConfigResponse.forEach((data => {
        this.menusId = data.MENUS_ID;
        this.moduleIds = data.MODULE_ID;
      }))

      // console.log(response)
      for (let i = 0; i < this.menuPanelResponse.length; i++) {
        for (let j = 0; j < this.getRoleConfigResponse.length; j++) {
          if (this.menuPanelResponse[i].id === this.getRoleConfigResponse[j].MODULE_ID) {
            this.menuPanelResponse[i].subMenu.forEach((data, index) => {
              this.getRoleConfigResponse[j].MENUS_ID.forEach(data1 => {

                if (data.id === data1) {
                  this.selectedMenu[i][index] = true;
                  const detail = this.updateConfigsControl as FormArray;
                  detail.push(
                    this.fb.group({
                      roleMasterId: new FormControl(this.roleId),
                      companyId: new FormControl(this.queueParseData?.COMPANY_ID),
                      createdBy: new FormControl(this.queueParseData.USER_ID),
                      menuId: new FormControl(this.menuPanelResponse[i].subMenu[index].id),
                      moduleId: new FormControl(this.menuPanelResponse[i].id),
                      updatedBy: new FormControl(this.queueParseData.USER_ID)
                    })
                  );
                  this.saveValue = 'Update'
                  // console.log(this.updateConfigsControl.value)
                }
              })
            })
          }
        }
      }
    }, error => {
      console.log(error);
    })
  }

  moduleIdValue: any;

  clickModule(i) {
    this.selectedIndex = i;
    this.subMenu = this.menuPanelResponse[i].subMenu;
    this.moduleIdValue = this.menuPanelResponse[i].id
  }

  AddIndex(menuIndex: any, subMenuIndex: any) {
    if (this.selectedMenu[menuIndex][subMenuIndex]) {

    }
  }

  closePopup() {
    this.openPop = false
    this.displayStyle = 'none'
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }

}
