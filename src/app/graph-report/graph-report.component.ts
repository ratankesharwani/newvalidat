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
  constructor(private service :AdminService,private shared : SharedService,private active :ActivatedRoute) {
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
        this.DashboardValue.forEach(({pass, fail, total,createdDate})=>{
          this.holdCount.push(pass)
          this.totalCount.push(total)
          this.failCount.push(fail)
          this.value.push(createdDate)
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

  option: echarts.EChartsOption;
  createGraph(){
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
          this.failCount
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
        // {
        //   type: 'line',
        //   smooth: true,
        //   seriesLayoutBy: 'row',
        //   emphasis: { focus: 'series' }
        // },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
        },
        // {
        //   type: 'pie',
        //   id: 'pie',
        //   radius: '30%',
        //   center: ['50%', '25%'],
        //   emphasis: {
        //     focus: 'self'
        //   },
        //   label: {
        //     formatter: '{b}: {@2012} ({d}%)'
        //   },
        //   encode: {
        //     itemName: 'product',
        //     value: this.value[1],
        //     tooltip: '2012'
        //   }
        // }
      ]
    };
  }
}