import {Component, ElementRef, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';
import * as echarts from 'echarts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import moment from 'moment';

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
  Dashboard:FormGroup
  @Input() Route: any;
  DashboardValue:any
  holdCount:any[]=[]
  totalCount:any[]=[]
  value:any[]=[]
  enable:boolean=false
  disabledRange:boolean=false
  maxFromDate = new Date();
  minFromDate:any
  minToDate:any
  maxToDate = new Date();
  from_Date: any
  to_Date: any
  dateInputFormat= 'DD/MM/YYYY'
  formValidation:boolean=true
  selectedValue=''
  viewMode:any='day'

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

    this.Dashboard=new FormGroup({
      request:new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl('PAYMENT_IN_DASHBOARD_GRAPH'),
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

      this.reloadGraph()
      type EChartsOption = echarts.EChartsOption;
    }

    get valueValidators(){
      return this.Dashboard['controls']['request']['controls']['body']['controls'];
    }
    
    dateChange(event: any) {
      switch (this.selectedValue) {
        case 'DEFAULT':
          this.Dashboard.patchValue({
            request:
            {
              body:
              {
                fromDate: null,
                month1: null,
                year1: null,
                toDate: null,
                month2: null,
                year2: null
              }
            }
          })
          this.formValidation = true
          break;
        case 'CUSTOM':
          this.formValidation = false
          this.Dashboard.patchValue({
            request:
            {
              body:
              {
                fromDate: event ? moment(event[0]).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
                month1: null,
                year1: null,
                toDate: event ? moment(event[1]).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null,
                month2:null,
                year2:null
              }
            }
          })
          this.formValidation = (this.valueValidators['fromDate'].value != null && this.valueValidators['toDate'].value != null)
          break;
        case 'YEAR':
          this.formValidation = false
          this.Dashboard.patchValue({
            request:
            {
              body:
              {
                fromDate: null,
                month1: null,
                year1: event ? moment(event[0]).format('YYYY') : null,
                toDate: null,
                month2: null,
                year2: event ? moment(event[1]).format('YYYY') : null
              }
            }
          })
          this.formValidation = (this.valueValidators['year1'].value != null && this.valueValidators['year2'].value != null)
          break;
        case 'MONTH':
          this.formValidation = false
          this.Dashboard.patchValue({
            request:
            {
              body:
              {
                fromDate: null,
                month1: event ? moment(event[0]).format('MMMM') : null,
                year1: event ? moment(event[0]).format('YYYY') : null,
                toDate: null,
                month2: event ? moment(event[1]).format('MMMM') : null,
                year2: event ? moment(event[1]).format('YYYY') : null,
              }
            }
          })
          this.formValidation = (this.valueValidators['year1'].value != null && this.valueValidators['year2'].value != null
            && this.valueValidators['month1'].value != null && this.valueValidators['month2'].value != null)
          break;
      }
     if(event){
       this.reloadGraph()
     }
    }

    lookForm(event:any){
      this.to_Date=null
      this.from_Date=null
      this.selectedValue=event
      switch (event) {
        case 'DEFAULT':
          this.disabledRange=false
          break;
        case 'CUSTOM':
          this.viewMode='day'
          this.dateInputFormat= 'DD/MM/YYYY'
          this.disabledRange=true
          break;
        case 'YEAR':
          this.viewMode='year'
          this.dateInputFormat= 'YYYY'
          this.disabledRange=true
          break;
        case 'MONTH':
          this.viewMode='month'
          this.dateInputFormat= 'MMMM/YYYY'
          this.disabledRange=true
          break;
      }
    }

    reloadGraph(){
      if(this.formValidation){
        this.service.payInList(this.Dashboard.value).subscribe(data=>{
          this.DashboardValue=data
          this.holdCount.splice(0)
          this.totalCount.splice(0)
          this.value.splice(0)
          this.holdCount.push('Payment Hold')
          this.totalCount.push('Payment In')
          this.value.push('product')
          this.DashboardValue.forEach(({HOLD_COUNT, TOTAL_COUNT, VALUE})=>{
            this.holdCount.push(HOLD_COUNT)
            this.totalCount.push(TOTAL_COUNT)
            this.value.push(VALUE.toString())
            this.craeteBarGraph()
          })
          this.shared.addPayin(this.Dashboard['controls']['request']['controls']['body'])
        })
      }
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
          // feature: {
          //   saveAsImage: {}
          // }
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
            data: this.value
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
            data: this.totalCount
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
            data: this.holdCount
          }
        ]
      };
      if (this.option) {
        this.chartInstance.setOption(this.option,true);
      }
    }
    craeteBarGraph(){
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
        xAxis: {
          type: 'category',
          data: this.value
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Payment In',
            data: this.totalCount,
            type: 'bar'
          },
           {
            name: 'Payment Out',
            data:this.holdCount,
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
          text: 'Incoming Funds',
          subtext: 'payments',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Incoming Funds',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.totalCount.reduce((pre,curr)=>{pre+curr}), name: 'Payment In' },
              { value: 735, name: 'Payment Out' }
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
          this.craeteBarGraph()
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
