import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, Renderer2, TemplateRef, ViewChild, Output ,EventEmitter, HostListener, ElementRef} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-filtersidebar',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './filtersidebar.component.html',
  styleUrl: './filtersidebar.component.css'
})
export class FiltersidebarComponent {
  @Output() searchEmit:EventEmitter<any> = new EventEmitter<any>();
  @Output() reset:EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('inputTemplate', { static: true }) inputTemplate: TemplateRef<any>;
  @ViewChild('selectTemplate', { static: true }) selectTemplate: TemplateRef<any>;


  private isBrowser: boolean;
  @Input() searchOptions:any[]=[]
  @Input() toggleButton:boolean=false

  constructor(private renderer: Renderer2,
     @Inject(PLATFORM_ID) private platformId: any,
     private elRef: ElementRef)
    {this.isBrowser = isPlatformBrowser(this.platformId)}


  click(){
    if (this.isBrowser) {
        this.renderer.removeClass(document.body, 'right-bar-enabled');
      }
  }
  ngOnDestroy() {
    if (this.isBrowser) {
      this.renderer.removeClass(document.body, 'right-bar-enabled');
    }
  }
  // @HostListener('document:click', ['$event'])
  // handleClick(event: Event) {
  //   if (!this.elRef.nativeElement.contains(event.target)) {
  //     this.renderer.removeClass(document.body, 'right-bar-enabled');
  //   }
  // }
  getOptions(column: any): string[] {
    return ['Option 1', 'Option 2', 'Option 3'];
  }
  getTemplate(dataType: string): TemplateRef<any> {
    switch (dataType) {
      case 'select':
        return this.selectTemplate;
      case 'input':
      default:
        return this.inputTemplate;
    }
  }
  searching(event:any):void{
    this.searchEmit.emit(event)
  }
  resetSearch():void{
    this.reset.emit()
  }
}
