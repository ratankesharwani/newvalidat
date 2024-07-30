import {Component, ElementRef, Input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import moment from "moment";
import * as echarts from 'echarts';
import { AdminService } from '../Service/admin.service';
import { SharedService } from '../Service/shared.service';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'app-graph-report',
    standalone: true,
    templateUrl: './graph-report.component.html',
    styleUrl: './graph-report.component.css',
    imports: [CommonModule, ReactiveFormsModule,RouterOutlet, BsDatepickerModule, InnerheaderComponent, FooterComponent]
})
export class GraphReportComponent {
  Dashboard:FormGroup
  @Input() Route: any;
  DashboardValue:any
  holdCount:any[]=[]
  totalCount:any[]=[]
  failCount:any[]=[]
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
  route:any
  name:any
  private chartInstance: any;
  constructor(private service :AdminService,private shared : SharedService,private active :ActivatedRoute,private el: ElementRef) {
    this.active.queryParamMap.subscribe((param)=>{
     this.route= param.get('route')
    })
    this.active.paramMap.subscribe((params)=>{
      this.name=params.get('id');
    })
    this.Dashboard=new FormGroup({
      request:new FormGroup({
        module:new FormControl('COMPLIANCE'),
        subModule:new FormControl(this.route),
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
        console.log(data)
        this.DashboardValue=data
        this.holdCount.splice(0)
        this.totalCount.splice(0)
        this.failCount.splice(0);
        this.value.splice(0)
        this.holdCount.push('Pass')
        this.totalCount.push('Total')
        this.failCount.push('Fail')
        this.value.push('product')
        this.DashboardValue.forEach(({pass, fail, total,pending,created_date,createdDate})=>{
          this.holdCount.push(pass)
          this.totalCount.push(total)
          this.failCount.push(fail)
          if(created_date)
          this.value.push(created_date)
          if(createdDate)
          this.value.push(createdDate)
        })
        this.createGraph()
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
          text: this.route.replace(/_/g, ' ')
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
  directSearch(range:any){
    const today = new Date();
    const lastRange = new Date(today);
    switch(range){
      case '12Years':
        lastRange.setFullYear(today.getFullYear() - 1);
        break;
      case '30Days':
        lastRange.setDate(today.getDate() - 30);
        break;
      case '7Days':
        lastRange.setDate(today.getDate() - 30);
        break;
      case '24Hours':
        lastRange.setDate(today.getDate() - 1);
        break;
    }
    this.Dashboard.patchValue({
      request:
      {
        body:
        {
          code:'CUSTOM',
          toDate:moment(today).format('YYYY-MM-DD'+'T00:00:00'+'.000Z'),
          month1:null,
          year1:null,
          fromDate: moment(lastRange).format('YYYY-MM-DD'+'T23:59:59'+'.000Z'),
          month2:null,
          year2:null,
        }
      }
    })
    if(range){
      this.reloadGraph()
    }
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
}