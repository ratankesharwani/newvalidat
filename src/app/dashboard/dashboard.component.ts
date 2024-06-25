import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { GraphComponent } from "../graph/graph.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    imports: [GraphComponent]
})
export class DashboardComponent{
  PayinDashBoard:FormGroup
  PayoutDashBoard:FormGroup
  PayinDashDetails:any
  PayoutDashDetails:any
  route: any
  title='Payment in graph'
  constructor(private service:AdminService,private shared:SharedService,private localStorage:LocalStorageService) {
    this.PayoutDashBoard=new FormGroup({
      request:new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl('PAYOUT_DASHBOARD'),
        body:new FormGroup({
          code:new FormControl('DEFAULT'),
          fromDate:new FormControl(''),
          toDate:new FormControl(''),
          year1:new FormControl(''),
          year2:new FormControl(''),
          month1:new FormControl(''),
          month2:new FormControl(''),
        })
      })
    })

    this.PayinDashBoard=new FormGroup({
      request:new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl('PAYIN_DASHBOARD'),
        body:new FormGroup({
          code:new FormControl('DEFAULT'),
          fromDate:new FormControl(''),
          toDate:new FormControl(''),
          year1:new FormControl(''),
          year2:new FormControl(''),
          month1:new FormControl(''),
          month2:new FormControl(''),
        })
      })
    })
  }
    addItem(data: any) {this.route = data;this.title = data=='pay-out-graph'?'Payment out graph':'Payment in graph'}
    ngOnInit(){
      this.shared.getPayin().subscribe(data=>{
        if(data){
          this.PayinDashBoard.patchValue({request:{body:data?.value}})
          this.service.payInList(this.PayinDashBoard.value).subscribe((data:any)=>{
            this.PayinDashDetails=data
          },error=>{
            console.log(error)
          })
        }else {
          this.service.payInList(this.PayinDashBoard.value).subscribe((data:any)=>{
            this.PayinDashDetails=data
          },error=>{
            console.log(error)
          })
        }
      })
      this.shared.getPayout().subscribe(data=>{
        if(data){
          this.PayoutDashBoard.patchValue({request:{body:data?.value}})
          this.service.payInList(this.PayoutDashBoard.value).subscribe((data:any)=>{
            this.PayoutDashDetails=data
          },error=>{
            console.log(error)
          })
        }else {
          this.service.payInList(this.PayoutDashBoard.value).subscribe((data:any)=>{
            this.PayoutDashDetails=data
          },error=>{
            console.log(error)
          })
        }
      })
    }
}
