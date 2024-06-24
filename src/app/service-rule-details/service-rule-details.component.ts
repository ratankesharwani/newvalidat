import { Component, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-service-rule-details',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatTooltip],
  templateUrl: './service-rule-details.component.html',
  styleUrl: './service-rule-details.component.css'
})
export class ServiceRuleDetailsComponent {
  getRulesById: FormGroup
  updateRulesForComp:FormGroup
  RuleDetails: any[]=[]
  flag:boolean=false
  displayStyle='none'
  alertMessage=''
  AlertMessage='Successfully'
  openPop:boolean=false
  fontColor='green'

  constructor(private service: AdminService, private router: Router,
              private active: ActivatedRoute,
              private localStorage:LocalStorageService) {
    if(this.active.snapshot.queryParams['status']==='true'){
      this.flag=true
    }
    this.updateRulesForComp=new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('TO_UPDATE_RULE'),
        body: new FormGroup({
          id:new FormControl(Number(this.active.snapshot.queryParams['id'])),
          moduleId:new FormControl(Number(this.active.snapshot.queryParams['moduleId'])),
          status:new FormControl(),
          updatedBy:new FormControl(Number(this.localStorage.getItem('userId'))),
          companyId: new FormControl(Number(this.active.snapshot.queryParams['companyId'])),
        })
      })
    })
    this.getRulesById = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('GET_RULE_DETAILS_BY_RULE_ID'),
        body: new FormGroup({
          masterId: new FormControl(Number(this.active.snapshot.queryParams['id'])),
        })

      })
    })
  }

  Company: any
  Module: any
  RuleName: any
  Status: any[]=[]
  Operator = '='

  ngOnInit() {
    this.service.payInList(this.getRulesById.value).subscribe((data:any) => {
      this.RuleDetails = data
     if(this.RuleDetails && Array.isArray(this.RuleDetails) && this.RuleDetails.length){
       for (let i = 0; i <= this.RuleDetails.length; i++){
        if(this.RuleDetails[i] && this.RuleDetails[i].companyName){
          this.Company = this.RuleDetails[i].companyName
         }
         if(this.RuleDetails[i] && this.RuleDetails[i].module){
          this.Module = this.RuleDetails[i].module
         }
         if(this.RuleDetails[i] && this.RuleDetails[i].ruleName){
          this.RuleName = this.RuleDetails[i].ruleName
         }
         if(this.RuleDetails[i] && this.RuleDetails[i].status){
           this.Status[i]='PASS'
         }
         else {
           this.Status[i]='FAIL'
         }
       }
     }
    })
  }
  updateRulesStatus(){
    this.service.payInList(this.updateRulesForComp.value).subscribe((data:any)=>{
      this.AlertMessage='Successful'
      this.openPop=true
      this.alertMessage = data.MSG
      this.fontColor='green'
    },error=>{
      this.AlertMessage='Warning !!'
      this.openPop=true
      this.alertMessage = error.error.ERROR
      this.fontColor='red'
    })
  }
  changeStatus(event:any){
    this.updateRulesForComp.patchValue({request:{body:{status:event.target.checked}}})
  }
  closePopup(){
    this.openPop=!this.openPop
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.updateRulesStatus()
  }
  goBack(){
    this.router.navigate(['Configuration/Add_Service_Rule'])
  }
}

