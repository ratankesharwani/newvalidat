import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from '../../environments/environment.prod';
import { AdminService } from '../Service/admin.service';
import { DownloadService } from '../Service/download.service';
import { LocalStorageService } from '../Service/local-storage.service';

@Component({
  selector: 'app-payout-service',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatPaginator],
  templateUrl: './payout-service.component.html',
  styleUrl: './payout-service.component.css'
})
export class PayoutServiceComponent {
  serviceForm: FormGroup
  serviceDetails: FormGroup
  repeatCheckForm: FormGroup
  sanctionCheckResultForm: FormGroup
  sanctionCheckResultForms=new Map()
  sanctionCheckResultValue=new Map()
  Display: any
  queueParseData: any
  repeatCheck: any[] = []
  spinner: boolean = false
  icon: any[] = []
  cross = 'cancel'
  check = 'check_circle'
  openPop: boolean = false
  AlertMessage = ''
  alertMessage = ''
  fontColor: any
  downloadUrl:any
  PageNumber=new Map()
  TotalElements=new Map()
  NumberOfElement=new Map()
  showAlert=new Map()
  constructor(private service: AdminService,private downloadService: DownloadService,
    private localStorage :LocalStorageService
  ) {
    const queueData: any = this.localStorage.getItem("payoutData")
    this.queueParseData = JSON.parse(queueData)

    this.serviceDetails = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('GET_SERVICE_DETAILS', [Validators.required]),
        body: new FormGroup({
          moduleId: new FormControl(this.queueParseData?.moduleId, [Validators.required]),
          integrationId: new FormControl(this.queueParseData?.id, Validators.required),
          serviceType: new FormControl(null)
        })
      })
    })
    this.repeatCheckForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('COMPLIANCE_CHECK', [Validators.required]),
        body: new FormGroup({
          complianceCheck: new FormGroup({
            moduleId: new FormControl(this.queueParseData?.moduleId, [Validators.required]),
            integrationId: new FormControl(this.queueParseData?.id, Validators.required),
            checkType: new FormControl(null),
            userId: new FormControl(Number(this.localStorage.getItem('userId')), Validators.required)
          }),
        })
      })
    })
    this.sanctionCheckResultForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('GET_EXTERNAL_CHECK_RESULT', [Validators.required]),
        body: new FormGroup({
          moduleId: new FormControl(this.queueParseData?.moduleId, [Validators.required]),
          externalServiceCheckId: new FormControl(null, Validators.required),
          serviceType: new FormControl(null),
          pageNumber: new FormControl(0),
          numberOfElements: new FormControl(10),
        }),
      })
    })

    this.serviceForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('SERVICE_PERFORMED', [Validators.required]),
        body: new FormGroup({
          moduleId: new FormControl(this.queueParseData?.moduleId, [Validators.required]),
          id: new FormControl(this.queueParseData?.id, Validators.required)
        })
      })
    });
  }

  ngOnInit() {

    // const sidebar = $('.accordion');
    // sidebar.on('show.bs.collapse', '.collapse', function() {
    //   sidebar.find('.collapse.show')['collapse']('hide');
    // });

    this.service.payInList(this.serviceForm.value).subscribe((data: any) => {
      this.Display = data
      this.insertionSort(this.Display)
      this.Details.forEach(() => {
        this.icon.push(false)
        this.repeatCheck.push(false)
        this.Details.push(null)
      })
    })
  }

  Details: any[] = []

  onClick(serviceName: any, index: any) {
    const openElement = document.getElementById('serviceName' + index)
    this.serviceDetails.patchValue({request:{body:{serviceType:serviceName}}})
    if (openElement?.ariaExpanded === 'true') {
      this.service.serviceDetails(this.serviceDetails.value).subscribe(data1 => {
        this.Details[index] = data1
        this.repeatCheck[index] = this.Details[index][0].type === 'EXTERNAL';
      }, error => {
        console.log(error)
      })
    }
  }
  sanctionCheckResult(serviceType:any,id:any,externalServiceCheckId:any){
    const openElement = document.getElementById('serviceNames' + id)
    if(openElement?.ariaExpanded === 'true'){
      this.sanctionCheckResultForm.patchValue({request:{body:{serviceType:serviceType,externalServiceCheckId:externalServiceCheckId,pageNumber:this.PageNumber.get(externalServiceCheckId),numberOfElements:this.NumberOfElement.get(externalServiceCheckId)}}})
      this.sanctionCheckResultForms.set(externalServiceCheckId,this.sanctionCheckResultForm.value);
      this.service.payInList(this.sanctionCheckResultForms.get(externalServiceCheckId)).subscribe((data:any)=>{
        this.PageNumber.set(externalServiceCheckId,data.number);
        this.TotalElements.set(externalServiceCheckId,data.totalElements)
        this.sanctionCheckResultValue.set(externalServiceCheckId,data.content)
        this.showAlert.set(externalServiceCheckId,this.sanctionCheckResultValue.get(externalServiceCheckId).length<=0)
      })
    }
  }
  handlePageEvent(e: PageEvent,key:any) {
    this.PageNumber.set(key,e.pageIndex)
    this.NumberOfElement.set(key,e.pageSize)
    this.sanctionCheckResultForm.patchValue({request:{body:{pageNumber:this.PageNumber.get(key),numberOfElements:this.NumberOfElement.get(key)}}})
    this.sanctionCheckResultForms.set(key,this.sanctionCheckResultForm.value);
    this.service.payInList(this.sanctionCheckResultForms.get(key)).subscribe((data:any)=>{
      this.PageNumber.set(key,data.number);
      this.TotalElements.set(key,data.totalElements)
      this.sanctionCheckResultValue.set(key,data.content)
    })
  }

  insertionSort(array: any[]): void {
    for (let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current.sort_order < array[j]?.sort_order && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }

  downloadRef(fileName: any, serviceTypeId: any) {
    if(environment.complianceUrl.split("/")[2]==='paragon.xend.com')
    {
      this.downloadUrl='https://paragon.xend.com/paragongateway/externallog/download'
    }else {
      this.downloadUrl='https://paragonuat.xend.com/paragongateway/externallog/download'
    }
    window.location.href = this.downloadUrl+`?fileName=${fileName}&serviceTypeId=${serviceTypeId}`
  }

  onRepeatCheck(serviceName: any, index: any) {
    this.closeCheck()
    this.spinner = true
    this.repeatCheckForm.value.request.body.complianceCheck.checkType = serviceName
    this.service.serviceDetails(this.repeatCheckForm.value).subscribe(data => {
      if (data.response) {
        this.fontColor = 'red'
        this.AlertMessage = 'Warning !!'
        this.alertMessage = 'This Funds already assigned to beneficiary'
        this.openPop = true
      }
      this.serviceDetails.value.request.body.serviceType = serviceName
      this.service.serviceDetails(this.serviceDetails.value).subscribe(data1 => {
        this.spinner = false
        this.Details[index] = data1
        this.repeatCheck[index] = this.Details[index][0].type === 'EXTERNAL';
      }, error => {
        console.log(error)
      })
    }, error => {
      this.spinner = false
      console.log(error)
    })
  }

  closePopup() {
    this.openPop = false
  }

  closeCheck() {
    const element = document.getElementById('confirmModal')
    element?.style.setProperty("display", "none")
  }

  repeatServiceName: any
  repeatIndex: any

  openCheck(serviceName: any, index: any) {
    this.repeatServiceName = serviceName
    this.repeatIndex = index
    const element = document.getElementById('confirmModal')
    element?.style.setProperty("display", "block")
  }

  createCheck() {
    this.onRepeatCheck(this.repeatServiceName, this.repeatIndex)
  }
  download(externalServiceCheckId:any,format:any,serviceName) {
    this.sanctionCheckResultForm.patchValue({request:{body:{numberOfElements:this.TotalElements.get(externalServiceCheckId)}}})
    this.service.payInList(this.sanctionCheckResultForms.get(externalServiceCheckId)).subscribe((data:any)=>{
      switch (format) {
        case 'XLS':
          this.downloadService.exportAsExcelFile(data.content, this.queueParseData.id+"_"+serviceName)
          break;
        case 'CSV':
          this.downloadService.exportAsCsvFile(data.content, this.queueParseData?.id+"_"+serviceName)
          break;
      }
    })
  }
  closeSanctionAlert(id:any){
    const closeElement = document.getElementById('Demo' + id)
    closeElement?.classList.remove('show')
  }
}

