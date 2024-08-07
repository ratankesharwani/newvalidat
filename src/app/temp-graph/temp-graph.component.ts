import { Component } from '@angular/core';
import { TempGraph01Component } from "../temp-graph01/temp-graph01.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InnerheaderComponent } from "../innerheader/innerheader.component";

@Component({
  selector: 'app-temp-graph',
  standalone: true,
  imports: [TempGraph01Component, RouterLinkActive, RouterLink, CommonModule, RouterOutlet, InnerheaderComponent],
  templateUrl: './temp-graph.component.html',
  styleUrl: './temp-graph.component.css'
})
export class TempGraphComponent {

}
