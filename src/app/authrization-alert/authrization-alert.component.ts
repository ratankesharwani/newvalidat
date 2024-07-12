import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authrization-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authrization-alert.component.html',
  styleUrl: './authrization-alert.component.css'
})
export class AuthrizationAlertComponent {
  @Input() display: boolean = true
  @Input() AlertMessage = ''
  @Input() Description = ''
  @Output() action: EventEmitter<any> = new EventEmitter<any>()
  animation: boolean = false
  clickedInside: any
  message: any

  constructor(private elementRef: ElementRef, @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<AuthrizationAlertComponent>) {
    this.message = data
  }

  @HostListener('document:click', ['$event.target'])
  onPageClick(targetElement) {
    this.clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (this.clickedInside) {
      if (this.display) {
        this.closeAlert()
      }
    }
  }

  closeAlert() {
    this.action.emit()
    this.display = !this.display
    let Interval = setInterval(() => {
      this.animation = !this.animation
      this.dialogRef.close(true)
      clearInterval(Interval)
    }, 250)
  }
}


