import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';

@Component({
  selector: 'app-temp-graph02',
  standalone: true,
  imports: [],
  templateUrl: './temp-graph02.component.html',
  styleUrl: './temp-graph02.component.css'
})
export class TempGraph02Component {
  PayinDashBoard:FormGroup
  PayoutDashBoard:FormGroup
  PayinDashDetails:any
  PayoutDashDetails:any
  route: any
  title='Payment in graph'
  constructor(private service:AdminService,private shared:SharedService) {
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
  }
    addItem(data: any) {this.route = data;this.title = data=='pay-out-graph'?'Payment out graph':'Payment in graph'}
    ngOnInit(){
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

