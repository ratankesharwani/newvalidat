import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filterbutton',
  standalone: true,
  imports: [],
  templateUrl: './filterbutton.component.html',
  styleUrl: './filterbutton.component.css'
})
export class FilterbuttonComponent {
  @Output() clickSearch :EventEmitter<any> = new EventEmitter()
  search(){
    this.clickSearch.emit("");
  }
}
