import { Component } from '@angular/core';
import { LocalStorageService } from '../Service/local-storage.service';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
    selector: 'app-out-dash',
    standalone: true,
    templateUrl: './out-dash.component.html',
    styleUrl: './out-dash.component.css',
    imports: [InnerheaderComponent, FooterComponent,RouterOutlet,DashboardComponent]
})
export class OutDashComponent {
constructor(private localStorage:LocalStorageService){}
ngOnInit(){
  this.localStorage.removeItem('forgotData')
  this.localStorage.removeItem('firstTimeLogin')
  this.localStorage.removeItem('OtpValid')
  this.localStorage.removeItem('UserEmailID')
}
}
