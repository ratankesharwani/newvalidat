import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PopupboxConfirmationComponent } from '../popupbox-confirmation/popupbox-confirmation.component';
import { PopupboxComponent } from '../popupbox/popupbox.component';

@Component({
  selector: 'app-service-rules',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,MatTooltip,RouterLink,PopupboxConfirmationComponent,PopupboxComponent],
  templateUrl: './service-rules.component.html',
  styleUrl: './service-rules.component.css',
  providers:[DatePipe]
})
export class ServiceRulesComponent {
  getRulesForComp: FormGroup
  updateRulesForComp: FormGroup
  getRulesForCompany: any
  displayStyle = 'none'
  alertMessage = ""
  animation:boolean=true
  display: boolean = false
  statusActive: any
  clickedInside:any
  currentDate=this.datepipe.transform((new Date), 'MM/dd/yyyy');
  openPop:boolean=false
  AlertMessage=''
  fontColor=''
  description = '';
  tabColumns=[
    {
      name:"Rule Name",
      key:'moduleName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Company Name",
      key:'companyName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Module Name",
      key:'columnName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created By",
      key:'blacklistType',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Created Date",
      key:'blacklistValue',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated By",
      key:'debtorName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Updated Date",
      key:'createdDate',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Status",
      key:'creator',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    },
    {
      name:"Action",
      key:'updatorName',
      search:true,
      dataType:"input",
      value:'',
      class:'form-control'
    }
  ]
  search:any

  constructor(private service: AdminService, private router: Router,
              private downloadService: DownloadService,
              private elementRef :ElementRef,
              public datepipe: DatePipe,private route:ActivatedRoute,
              private localStorage:LocalStorageService) {

    this.getRulesForComp = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('GET_RULES_FOR_COMPANY'),
        body: new FormGroup({
          companyId: new FormControl(Number(this.localStorage.getItem('companyId'))),
        })
      })
    })
    this.updateRulesForComp = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('TO_UPDATE_RULE'),
        body: new FormGroup({
          id: new FormControl(),
          moduleId: new FormControl(),
          status: new FormControl(),
          updatedBy: new FormControl(Number(this.localStorage.getItem('userId'))),
          companyId: new FormControl(Number(this.localStorage.getItem('companyId'))),
        })
      })
    })
  }

  CSV() {
    this.service.payInList(this.getRulesForComp.value).subscribe((data: any) => {
      this.downloadService.exportAsCsvFile(data, 'Service_Rule_Export-'+this.currentDate)
    })
  }

  XLS() {
    this.service.payInList(this.getRulesForComp.value).subscribe((data: any) => {
      this.downloadService.exportAsExcelFile(data, 'Service_Rule_Export-'+this.currentDate)
    })
  }

  ngOnInit() {
    this.service.payInList(this.getRulesForComp.value).subscribe(data => {
      this.getRulesForCompany = data
    })
  }

  updateRulesStatus(Id: any, ModuleId: any, CompanyId: any, Status: any) {
    this.statusActive=!Status
    this.animation=!this.animation
    this.updateRulesForComp.patchValue({
      request: {
        body: {
          id: Id,
          moduleId: ModuleId,
          companyId: CompanyId,
          status: !Status
        }
      }
    })
  }

  ruleDetailsById(id: any, status: any, moduleId: any, companyId: any) {
    this.router.navigate(['/Configuration/Service_Rule_Details'],
      {
        queryParams: {
          id: id, status: status,
          moduleId: moduleId,
          companyId: companyId
        }
      })
  }

  closePopup() {
    this.openPop=false
    this.alertMessage = ''
    this.displayStyle = "none"
  }
  closeAlert() {
    this.display = true
    let Interval=setInterval(()=>{
      this.animation=true
      this.display=false
      clearInterval(Interval)
    },300)
  }
  confirmStatus() {
    this.service.payInList(this.updateRulesForComp.value).subscribe((data: any) => {
      this.ngOnInit()
    }, error => {
      this.openPop=true
      this.alertMessage=error.error.ERROR
      this.AlertMessage='Warning !!'
      this.fontColor='red'
    })
  }
  // @HostListener('document:click', ['$event.target'])
  // onPageClick(targetElement){
  //   this.clickedInside=this.elementRef.nativeElement.querySelector('.alertHolder').contains(targetElement);
  //   if(this.clickedInside){
  //     if(!this.display){
  //       this.closeAlert()
  //     }
  //   }
  // }
}

