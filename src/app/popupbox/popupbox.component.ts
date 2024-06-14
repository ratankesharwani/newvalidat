import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popupbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popupbox.component.html',
  styleUrl: './popupbox.component.css'
})
export class PopupboxComponent {
  @Input() display: boolean = false
  @Input() AlertMessage = ''
  @Input() Description = ''
  @Output() action: EventEmitter<any> = new EventEmitter<any>()
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
    this.action.emit(false)
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
  confirmStatus(){
    this.action.emit(true)
    let Interval=setInterval(()=>{
      this.hideDisplay=!this.hideDisplay
      clearInterval(Interval)
    },300)
  }
}
