import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-popupbox-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popupbox-confirmation.component.html',
  styleUrl: './popupbox-confirmation.component.css'
})
export class PopupboxConfirmationComponent implements OnChanges{
  @Input() display: boolean = false
  @Input() AlertMessage = ''
  @Input() Description = ''
  @Output() action: EventEmitter<any> = new EventEmitter<any>()
  @Input() fontColor = 'green'
  hideDisplay:boolean=true
  clickedInside:any
  constructor(private elementRef: ElementRef) {
  }
  @HostListener('document:click', ['$event.target'])
  onPageClick(targetElement){
    this.clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if(this.clickedInside){
     if(this.display){
       this.closeAlert()
     }
    }
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(this.display){
      this.closeAlert()
    }
  }
  closeAlert() {
    this.action.emit()
    this.display = !this.display
    let Interval=setInterval(()=>{
      this.hideDisplay=!this.hideDisplay
      clearInterval(Interval)
    },300)
  }
  ngOnChanges() {
    if(this.display){
      this.hideDisplay=!this.hideDisplay
    }
  }
}
