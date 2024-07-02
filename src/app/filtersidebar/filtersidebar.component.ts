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
  @ViewChild('dateTemplate', { static: true }) dateTemplate: TemplateRef<any>;


  private isBrowser: boolean;
  @Input() searchOptions:any[]=[]
  @Input() toggleButton:boolean=false

  maxDate = new Date();

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
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    // const excludedElement = targetElement.querySelector('app-filterbutton');
    // console.log(event.target,excludedElement,'excludedElement');
    
    // const excludedElement = document.querySelector('app-filterbutton');

    // if (excludedElement && !excludedElement.contains(targetElement)) {
    //   console.log('Clicked outside app-filterbutton:', targetElement);
    //   // Your logic here
    // } else {
    //   console.log('Clicked inside app-filterbutton or it does not exist:', targetElement);
    // }
    // if (!this.elRef.nativeElement.contains(targetElement) && !excludedElement?.contains(targetElement)) {
    //   const hasClass = document.body.classList.contains('right-bar-enabled');
    //   if (hasClass) {
    //     this.renderer.removeClass(document.body, 'right-bar-enabled');
    //   }
    // }
  }
  getOptions(column: any): string[] {
    return ['Option 1', 'Option 2', 'Option 3'];
  }
  getTemplate(dataType: string): TemplateRef<any> {
    switch (dataType) {
      case 'select':
        return this.selectTemplate;
      case 'date':
        return this.dateTemplate;
      case 'input':
        return this.inputTemplate;
      default:
        return this.inputTemplate;
    }
  }
  searching(event:any):void{
    this.searchEmit.emit(event)
  }
  resetSearch():void{
    this.reset.emit()
    Array.from(document.querySelectorAll("select")).forEach(
      input => (input.value = 'null')
    );
  }
}
