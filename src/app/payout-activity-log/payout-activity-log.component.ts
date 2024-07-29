import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { LocalStorageService } from '../Service/local-storage.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-payout-activity-log',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './payout-activity-log.component.html',
  styleUrl: './payout-activity-log.component.css'
})
export class PayoutActivityLogComponent {
  ActivityLog: FormGroup
  ActivityLogType: FormGroup
  queueParseData: any
  memodata: any
  logType: any
  maxFromDate = new Date();
  minFromDate:any
  minToDate:any
  maxToDate = new Date();
  from_Date: any
  to_Date: any
  hideColumn: boolean = true

  constructor(private service: AdminService,private localStorage :LocalStorageService) {
    const queueData: any = this.localStorage.getItem("payoutData")
    this.queueParseData = JSON.parse(queueData)

    this.activityForm()

    this.ActivityLogType = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('SYS_LOOKUP_DROPDOWN', [Validators.required]),
        body: new FormGroup({
          sysLookupName: new FormControl('ActivityLog', Validators.required)
        })
      })
    });
  }

  ngOnInit() {
    this.activityLog()
    this.service.login(this.ActivityLogType.value).subscribe(data => {
      this.logType = data
    })
  }

  save() {
    this.activityLog()
  }

  fromD(event: any) {
    this.ActivityLog.patchValue({request: {body: {fromCreatedOn: event ? event : null}}})
    this.minToDate=event
    this.to_Date=(this.to_Date && event>this.to_Date)?null:this.to_Date
  }
  toD(event: any) {
    this.ActivityLog.patchValue({request: {body: {toCreatedOn: event ? event : null}}})
  }

  dateChange(event: any) {
    this.ActivityLog.patchValue({
      request: {
        body: {
          fromCreatedOn: event ? moment(event[0]).format('YYYY-MM-DD' + 'T00:00:00' + '.000Z') : null,
          toCreatedOn: event ? moment(event[1]).format('YYYY-MM-DD' + 'T23:59:59' + '.000Z') : null
        }
      }
    })
   this.activityLog();
  }

  activityLog() {
    this.service.login(this.ActivityLog.value).subscribe(data => {
      this.memodata = data
      console.log(data)
    })
  }

  activityForm() {
    this.ActivityLog = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('GET_ACTIVITIES_MEMO', [Validators.required]),
        body: new FormGroup({
          integrationId: new FormControl(this.queueParseData?.id, [Validators.required]),
          moduleId: new FormControl(this.queueParseData?.moduleId, Validators.required),
          memoCategoryId: new FormControl(17, Validators.required),
          toCreatedOn: new FormControl(null),
          fromCreatedOn: new FormControl(null)
        })
      })
    });
  }

  clearMemo() {
    this.ActivityLog.patchValue({
      request: {
        body: {
          fromCreatedOn:  null,
          toCreatedOn: null,
          memoCategoryId:17
        }
      }
    })
    this.activityLog()
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = '01-01-2023 - 01-01-2024')
    );
  }


  onChangeMemoType(memo: any) {
    this.hideColumn = memo !== 18;
    this.activityLog();
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.save()
  }
}


