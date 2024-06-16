import { Component } from '@angular/core';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-report',
    standalone: true,
    templateUrl: './report.component.html',
    styleUrl: './report.component.css',
    imports: [InnerheaderComponent,RouterOutlet, FooterComponent]
})
export class ReportComponent {

}
