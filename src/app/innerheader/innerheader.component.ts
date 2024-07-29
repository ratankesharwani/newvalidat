import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-innerheader',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink,RouterLinkActive,MatTooltip],
  templateUrl: './innerheader.component.html',
  styleUrl: './innerheader.component.css'
})
export class InnerheaderComponent {
  loginForm:FormGroup
  roleBaseMenu:FormGroup
  menuPanel:any
  roleBaseMenuPanel:any
  queueParseData:any
  Sorting:any[]=[]

  @ViewChild('Admin', { static: true }) Admin: TemplateRef<any>;
  @ViewChild('User_Permission', { static: true }) User_Permission: TemplateRef<any>;
  @ViewChild('Compliance', { static: true }) Compliance: TemplateRef<any>;
  @ViewChild('Configuration', { static: true }) Configuration: TemplateRef<any>;
  @ViewChild('Report', { static: true }) Report: TemplateRef<any>;

  
  constructor(private localStorage :LocalStorageService,private service:AdminService) {
    const queueData:any = this.localStorage.getItem("data")
    this.queueParseData=JSON.parse(queueData)

    this.loginForm = new FormGroup({
      request: new FormGroup({
        module : new FormControl('COMPLIANCE',[Validators.required]),
        subModule: new FormControl('MENU_PANEL',[Validators.required]),
        body: new FormGroup({})
      })
    });
    this.roleBaseMenu=new FormGroup({
      request: new FormGroup({
        module : new FormControl('COMPLIANCE',[Validators.required]),
        subModule: new FormControl('ROLE_BASE_MENU',[Validators.required]),
        body: new FormGroup({
          userId: new FormControl(this.queueParseData?.USER_ID||1, Validators.required),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID||2, Validators.required),
          userType:new FormControl(this.queueParseData?.USER_TYPE||'NULL')
        })
      })
    })
  }
  ngOnInit() {
    this.localStorage.removeItem('tabAllow')
    this.service.menuPanel(this.roleBaseMenu.value).subscribe((data:any)=>{
      this.roleBaseMenuPanel=data.menu

      this.insertionSort(this.roleBaseMenuPanel)
      console.log(this.roleBaseMenuPanel);

      for(let i=0;i<this.roleBaseMenuPanel.length;i++){
        this.insertionSort(this.roleBaseMenuPanel[i].subMenu)
        if(this.roleBaseMenuPanel[i].key==='Compliance'){
          this.localStorage.setItem('tabAllow','true')
        }
        this.Sorting.push(i)
        for(let j=0;j<this.Icon.length;j++){
          if(this.roleBaseMenuPanel[i].key===this.Icon[j].menu){
            this.icons.push(this.Icon[i].icon)}}}
    },error => {
      console.log(error)
    })
  }
  onLogOut(){
    this.localStorage.clear();
    this.service.loggedIn=false;
  }
  Icon = [
    {
      menu: 'Admin',
      icon: 'admin_panel_settings'
    },
    {
      menu: 'User_Permission',
      icon: 'verified_user'
    },
    {
      menu: 'Payment',
      icon: 'payments'
    },
    {
      menu: 'Configuration',
      icon: 'settings'
    },
    {
      menu: 'Compliance',
      icon: 'clinical_notes'
    },
    {
      menu:'Report',
      icon:'quick_reference_all'
    },
    {
      menu: 'Banking',
      icon: 'attach_money'
    }]
  icons:any[] = []

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

  getSvgTemplate(svgKey: string): TemplateRef<any> {
    switch (svgKey) {
      case 'Admin':
        return this.Admin;
      case 'User_Permission':
        return this.User_Permission;
      case 'Compliance':
        return this.Compliance;
      case 'Configuration':
        return this.Configuration;
      case 'Report':
        return this.Report;
      default:
        return this.Admin; 
    }
  }

}
