import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {EChartsOption} from "echarts";
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
  option: EChartsOption;
  route: any
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
    addItem(data: any) {this.route = data;}
    ngOnInit(){
      this.option = {
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
          },
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Payment In', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Payment Hold', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cleared', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            // ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          // {
          //   type: 'line',
          //   smooth: true,
          //   seriesLayoutBy: 'row',
          //   emphasis: { focus: 'series' }
          // },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };
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
