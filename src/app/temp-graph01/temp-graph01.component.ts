import {Component, ElementRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';
import * as echarts from 'echarts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-temp-graph01',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,BsDatepickerModule,RouterLink,RouterLinkActive],
  templateUrl: './temp-graph01.component.html',
  styleUrl: './temp-graph01.component.css'
})
export class TempGraph01Component {
  PayinDashBoard:FormGroup
  PayinDashDetails:any
  route: any
  title='Payment in graph'
  private chartInstance: any;

  constructor(private service:AdminService,private shared:SharedService,private el: ElementRef) {
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
      this.createLineGraph()
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
    }
    option: any;
    createLineGraph(){
      const chartDom = this.el.nativeElement.querySelector('#chart');
      this.chartInstance = echarts.init(chartDom);
      this.option = {
        title: {
          text: 'Incoming Funds'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Payment In', 'Payment Out']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Payment In',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Payment Out',
            type: 'line',
            stack: 'Total',
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      
      
      if (this.option) {
        this.chartInstance.setOption(this.option,true);
      }
    }
    craeteBarGrapg(){
      const chartDom = this.el.nativeElement.querySelector('#chart');
      this.chartInstance = echarts.init(chartDom);
      this.option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          },
           {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      };
      if (this.option) {
        this.chartInstance.setOption(this.option,true);
      }
    }
    createPieGraph(){
      const chartDom = this.el.nativeElement.querySelector('#chart');
      this.chartInstance = echarts.init(chartDom);
      this.option = {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      
      if (this.option) {
        this.chartInstance.setOption(this.option,true);
      }
    }
    createGraph(type:string){
      switch (type){
         case 'line':
          this.createLineGraph()
          break;
         case 'bar':
          this.craeteBarGrapg()
          break;
         case 'pie':
          this.createPieGraph()
          break;
      }
    }
    downloadChart(): void {
      if (this.chartInstance) {
        const url = this.chartInstance.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
  
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chart.png';
        link.click();
      }
    }
}
