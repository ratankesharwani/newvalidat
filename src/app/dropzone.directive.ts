import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import Dropzone from 'dropzone';

@Directive({
  selector: '[appDropzone]'
})
export class DropzoneDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const previewTemplate = `
      <div class="dz-preview dz-file-preview">
        <div class="dz-image"><img data-dz-thumbnail /></div>
        <div class="dz-details">
          <div class="dz-size"><span data-dz-size></span></div>
          <div class="dz-filename"><span data-dz-name></span></div>
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
        <button class="dz-remove" data-dz-remove>Remove file</button>
      </div>`;

    const myDropzone = new Dropzone(this.el.nativeElement, {
      url: '#', // or provide an actual URL
      maxFilesize: 2, // MB
      maxFiles: 1,
      acceptedFiles: 'image/*,application/pdf,.xlsx,.xls,.csv,.doc,.docx,.zip,.rar,.mht,.msg,.gif',
      previewTemplate: previewTemplate,
      init: function() {
        this.on("addedfile", function(file) {
          console.log("Added file: ", file);
        });
        this.on("removedfile", function(file) {
          console.log("Removed file: ", file);
        });
        this.on("error", function(file, response) {
          console.log("File error: ", response);
        });
      }
    });
  }
}
