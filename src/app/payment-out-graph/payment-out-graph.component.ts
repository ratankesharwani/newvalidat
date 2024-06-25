import {Component, ElementRef, Input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import moment from "moment";
import * as echarts from 'echarts';
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-payment-out-graph',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './payment-out-graph.component.html',
  styleUrl: './payment-out-graph.component.css'
})
export class PaymentOutGraphComponent {
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
        subModule:new FormControl('PAYMENT_OUT_DASHBOARD_GRAPH'),
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
          this.value,
          this.totalCount,
          this.holdCount,
          // ['Cleared', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
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
            value: this.value[1],
            tooltip: '2012'
          }
        }
      ]
    };
    if (this.option) {
      this.chartInstance.setOption(this.option,true);
    }
    // this.option && myChart.setOption(this.option);
  }
}

