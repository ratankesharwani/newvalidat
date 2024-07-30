import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-graph',
  standalone:true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  imports: [ReactiveFormsModule,CommonModule,RouterOutlet],
})
export class GraphComponent implements OnChanges{
  @Input() Graph: any;
constructor(private router:Router) {this.Graph='';}
  ngOnChanges(){
    if(this.Graph){
      this.route()
    }
  }
  route(){
    this.router.navigate(['/dashboard/graph',this.Graph])
  }
  ngOnInit(){
    this.router.navigate(['/dashboard/graph/payin'])
  }
}
