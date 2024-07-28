import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import Dropzone from 'dropzone';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.css'
})
export class DropzoneComponent implements AfterViewInit {
    @ViewChild('myDropzone', { static: false }) dropzoneElement: any;
    dropzone: any;
    formData: FormData = new FormData();
  
    ngAfterViewInit() {
      this.initializeDropzone();
    }
  
    initializeDropzone() {
      this.dropzone = new Dropzone(this.dropzoneElement.nativeElement, {
        url: 'http://localhost:5212/api/Files/Upload',  // Replace with your upload URL
        maxFilesize: 10,  // Max filesize in MB
        acceptedFiles: '.jpg,.jpeg,.png,.gif,.xlsx,.xls,.pdf,.csv,.doc,.docx,.zip,.rar,.mht,.msg',
        maxFiles: 1,    
        dictDefaultMessage: 'Drop files here or click to upload',
        dictFallbackMessage: 'Your browser does not support drag and drop file uploads.',
        dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
        dictInvalidFileType: 'You can\'t upload files of this type.',
        dictResponseError: 'Server responded with {{statusCode}} code.',
        dictCancelUpload: 'Cancel upload',
        dictCancelUploadConfirmation: 'Are you sure you want to cancel this upload?',
        dictRemoveFile: 'Remove file',
        dictMaxFilesExceeded: 'You can not upload any more files.',
        addRemoveLinks: true,
        clickable: true,
      });
  
      // Optional event listeners
      this.dropzone.on('success', (file: any, response: any) => {
        console.log('File uploaded successfully:');
      });
  
      this.dropzone.on('error', (file: any, errorMessage: string) => {
        console.error('Error uploading file:', file, errorMessage);
      });
    }
  }
