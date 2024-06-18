import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../Service/local-storage.service';
import { DropzoneDirective } from '../dropzone.directive';
@Component({
  selector: 'app-payin-docs',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './payin-docs.component.html',
  styleUrl: './payin-docs.component.css',
  providers:[DropzoneDirective]
})
export class PayinDocsComponent {
  @ViewChild('myFile')
  myInputVariable: ElementRef;
  allDocuments: FormGroup
  UploadForm: FormGroup
  AllDocuments: any
  queueParseData: any
  DocumentType: FormGroup
  displayStyle = 'none'
  alertMessage = ''
  openPop: boolean = false
  AlertMessage = ''
  ValidDocuments: FormGroup
  ValidDocument: any
  acceptDocs=['jpg','jpeg','doc','docx','xls','xlsx','png','csv','pdf','xlx']
  spinner: boolean = false

  constructor(private service: AdminService,private localStorage:LocalStorageService) {

    const queueData: any = this.localStorage.getItem("queueData")
    this.queueParseData = JSON.parse(queueData)

    this.DocumentType = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('SUB_STATUS_DROPDOWN'),
        body: new FormGroup({sysLookupName: new FormControl('PAYMENT_IN')})
      })
    });

    this.ValidDocuments = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('DOCUMENT_TYPE'),
        body: new FormGroup({})
      })
    });

    this.allDocuments = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE', [Validators.required]),
        subModule: new FormControl('ALL_DOCUMENT', [Validators.required]),
        body: new FormGroup({
          integrationId: new FormControl(this.queueParseData?.id, [Validators.required]),
          moduleId: new FormControl(this.queueParseData?.moduleId, Validators.required)
        })
      })
    });
  }

  Documents: any

  ngOnInit() {
    this.UploadForm = new FormGroup({
      file: new FormControl(null, [Validators.required]),
      description: new FormControl(null, Validators.required),
      documentTypeId: new FormControl(null, Validators.required)
    })

    this.service.allDocuments(this.allDocuments.value).subscribe(data => {
      this.AllDocuments = data
    })
    this.service.payInList(this.DocumentType.value).subscribe(data => {
      this.Documents = data
      this.insertionSort(this.Documents);
    })
    this.service.payInList(this.ValidDocuments.value).subscribe((data: any) => {
      this.ValidDocument = data.value
    })
  }

  formData = new FormData();
  file: File
  fileCheck: boolean = false
  fileLimit: boolean = false
  fileSize: any
  fontColor:any
  upLoadFile(event: any) {
    if (event) {
      this.file = event.target.files[0]
      const fileExt: any = this.file?.name.split('.').pop();
      this.fileCheck = !this.ValidDocument.includes(fileExt?.toLowerCase());
      this.fileLimit = false
      if (!this.fileCheck) {
        if (this.file.size > 10385260) {
          this.fileSize = Math.round(this.file.size / 1048576) + "MB"
          this.fileLimit = true
        }
      }
    }
  }

  uploadForm() {
    this.spinner=true
    this.formData.append("documentTypeId", this.UploadForm.controls['documentTypeId'].value)
    this.formData.append("file", this.file,)
    this.formData.append("integrationId", this.queueParseData?.id)
    this.formData.append("clientId", this.queueParseData?.clientId)
    const userId: any = this.localStorage.getItem("userId")
    this.formData.append("uploadedBy", userId)
    this.formData.append("description", this.UploadForm.controls['description'].value)
    this.formData.append("moduleId", this.queueParseData?.moduleId)
    this.Submit()
  }
  insertionSort(array: any[]): void {
    for(let i = 1; i < array.length; i++) {
      const current = array[i];
      let j = i - 1;
      while (current?.display_field< array[j]?.display_field && j >= 0) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
  }

  downloadDoc(name: any) {
    this.service.downloadDocuments(name)
  }

  get descControl() {
    return this.UploadForm.controls['description']
  }

  get docControl() {
    return this.UploadForm.controls['documentTypeId']
  }

  get fileControl() {
    return this.UploadForm.controls['file']
  }

  closePopup() {
    this.openPop = false
  }

  submitted: boolean = false

  Submit() {
    this.submitted = true
    this.service.uploadFile1(this.formData).subscribe(data => {
      this.spinner=false
      this.submitted = false
      this.openPop = true
      this.fontColor= 'green'
      this.AlertMessage = 'Successful !!'
      this.alertMessage = "Document Uploaded"
      this.myInputVariable.nativeElement.value = null;
      this.formData.delete("description")
      this.formData.delete("documentTypeId")
      this.formData.delete("file")
      this.formData = new FormData()
      this.ngOnInit()
    }, error => {
      this.spinner=false
      this.fontColor = 'red'
      this.openPop = true
      this.AlertMessage = 'Warning !!'
      this.alertMessage = error.error.ERROR
      console.log(error)
      this.myInputVariable.nativeElement.value = null;
      this.formData = new FormData()
      this.formData.delete("file")
      this.UploadForm.patchValue({
        file:null,
        description:null,
        documentTypeId:null
      })
      // this.ngOnInit()
    })
  }
  // @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   if((this.UploadForm.valid && !this.fileLimit && !this.fileCheck)){
  //     this.uploadForm()
  //   }else {
  //     this.submitted = true
  //   }
  // }
}

