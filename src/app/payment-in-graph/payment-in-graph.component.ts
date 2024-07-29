import {Component, ElementRef, Input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import moment from "moment";
import * as echarts from 'echarts';
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-payment-in-graph',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './payment-in-graph.component.html',
  styleUrls: ['./payment-in-graph.component.css']
})
export class PaymentInGraphComponent{
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
  private chartInstance: any;
  constructor(private service :AdminService,private shared : SharedService,private el: ElementRef) {
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
  ngOnInit() {
    this.reloadGraph()
    // this.createGraph()
    type EChartsOption = echarts.EChartsOption;
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
          this.createGraph()
        })
        this.shared.addPayin(this.Dashboard['controls']['request']['controls']['body'])
      })
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
  onOpenCalendar(container) {
    switch (this.selectedValue) {
      case 'DEFAULT':
        break;
      case 'CUSTOM':
        container.daySelectHandler = (event: any): void => {
          container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('day');
        break;
      case 'YEAR':
        container.yearSelectHandler = (event: any): void => {
          container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('year');
        break;
      case 'MONTH':
        container.monthSelectHandler = (event: any): void => {
          container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
        break;
    }
  }
  fromD(event: any) {
    switch (this.selectedValue) {
      case 'DEFAULT':
        this.Dashboard.patchValue({request:
            {body:
                {fromDate:null,
                  month1:null,
                  year1:null}}})
        this.formValidation=true
        break;
      case 'CUSTOM':
        this.formValidation=false
        this.Dashboard.patchValue({request:
            {body:
                {fromDate: event ? moment(event).format('YYYY-MM-DD'+'T00:00:00'+'.000Z') : null,
                  month1:null,
                  year1:null}}})
        this.formValidation=(this.valueValidators['fromDate'].value!=null && this.valueValidators['toDate'].value!=null)
        break;
      case 'YEAR':
        this.formValidation=false
        this.Dashboard.patchValue({request:
            {body:
                {fromDate:null,
                  month1:null,
                  year1:event ? moment(event).format('YYYY') : null}}})
        this.formValidation=(this.valueValidators['year1'].value!=null && this.valueValidators['year2'].value!=null)
        break;
      case 'MONTH':
        this.formValidation=false
        this.Dashboard.patchValue({request:
            {body:
                {fromDate: null,
                  month1:event ? moment(event).format('MMMM') : null,
                  year1:event ? moment(event).format('YYYY') : null}}})
        this.formValidation=(this.valueValidators['year1'].value!=null && this.valueValidators['year2'].value!=null
          && this.valueValidators['month1'].value!=null && this.valueValidators['month2'].value!=null)
        break;
    }
    this.minToDate=event
    this.to_Date=(this.to_Date && event>this.to_Date)?null:this.to_Date
   if(event){
     this.reloadGraph()
   }
  }
  toD(event: any) {
    switch (this.selectedValue) {
      case 'DEFAULT':
        this.Dashboard.patchValue({request:
            {body:
                {toDate:null,
                  month2:null,
                  year2:null}}})
        this.formValidation=true
        break;
      case 'CUSTOM':
        this.formValidation=false
        this.Dashboard.patchValue({request:
            {body:
                {toDate: event ? moment(event).format('YYYY-MM-DD'+'T23:59:59'+'.000Z') : null,
                  month2:null,
                  year2:null}}})
        this.formValidation=(this.valueValidators['fromDate'].value!=null && this.valueValidators['toDate'].value!=null)
        break;
      case 'YEAR':
        this.formValidation=false
        this.Dashboard.patchValue({request:
            {body:
                {toDate:null,
                  month2:null,
                  year2:event ? moment(event).format('YYYY') : null}}})
        this.formValidation=(this.valueValidators['year1'].value!=null && this.valueValidators['year2'].value!=null)
        break;
      case 'MONTH':
        this.formValidation=false
        this.Dashboard.patchValue({request:
            {body:
                {toDate: null,
                  month2:event ? moment(event).format('MMMM') : null,
                  year2:event ? moment(event).format('YYYY') : null,}}})
        this.formValidation=(this.valueValidators['year1'].value!=null && this.valueValidators['year2'].value!=null
          && this.valueValidators['month1'].value!=null && this.valueValidators['month2'].value!=null)
        break;
    }
    if(event){
      this.reloadGraph()
    }
  }
  get valueValidators(){
    return this.Dashboard['controls']['request']['controls']['body']['controls'];
  }

  option: any;
  createGraph(){
    const chartDom = this.el.nativeElement.querySelector('#chart');
    this.chartInstance = echarts.init(chartDom);
    this.option = {
      title: {
        text: 'Payment in',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          // dataZoom: {
          //   yAxisIndex: 'none',
          // },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.value
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} payment',
        },
      },
      series: [
        {
          name: 'Payment In',
          type: 'line',
          data: this.totalCount
          // markPoint: {
          //   data: [
          //     { type: 'max', name: 'Max' },
          //     { type: 'min', name: 'Min' },
          //   ],
          // },
          // markLine: {
          //   data: [{ type: 'average', name: 'Avg' }],
          // },
        },
        {
          name: 'Payin Queue',
          type: 'line',
          data: this.holdCount
          // markLine: {
          //   data: [
          //     { type: 'average', name: 'Avg' },
          //     [
          //       {
          //         symbol: 'none',
          //         x: '90%',
          //         yAxis: 'max',
          //       },
          //       {
          //         symbol: 'circle',
          //         label: {
          //           position: 'start',
          //           formatter: 'Max',
          //         },
          //         type: 'max',
          //         name: '最高点',
          //       },
          //     ],
          //   ],
          // },
        },
      ],
    };
    
    
    if (this.option) {
      this.chartInstance.setOption(this.option,true);
    }
    // this.option && myChart.setOption(this.option);
  }
}
