import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FilterbuttonComponent } from "../filterbutton/filterbutton.component";
import { PaymentinComponent } from "../paymentin/paymentin.component";
import { FooterComponent } from "../footer/footer.component";
import { isPlatformBrowser } from '@angular/common';
import { PaymentoutComponent } from "../paymentout/paymentout.component";
import { FiltersidebarComponent } from "../filtersidebar/filtersidebar.component";
import { AddserviceruleComponent } from "../addservicerule/addservicerule.component";
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from '../Service/local-storage.service';

@Component({
    selector: 'app-compliance',
    standalone: true,
    templateUrl: './compliance.component.html',
    styleUrl: './compliance.component.css',
    imports: [
      InnerheaderComponent,
      RouterOutlet,
      FilterbuttonComponent,
      PaymentinComponent,
      FooterComponent,
      PaymentoutComponent,
      FiltersidebarComponent,
      AddserviceruleComponent
    ]
})
export class ComplianceComponent {
  private isBrowser: boolean;
  toggleButton:boolean=false
  activeComponent:any

  title = 'newvalidat';
  constructor(private renderer: Renderer2,private localStorage:LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {this.isBrowser = isPlatformBrowser(this.platformId);}

  click(){
    if (this.isBrowser) {
        this.toggleButton=true
        if(this.activeComponent instanceof PaymentinComponent || this.activeComponent instanceof PaymentoutComponent){
          this.activeComponent.toggleButton=this.toggleButton
        }
        this.renderer.addClass(document.body, 'right-bar-enabled');
    }
  }
  ngOnDestroy() {
    if (this.isBrowser) {
      this.renderer.removeClass(document.body, 'right-bar-enabled');
    }
  }
  onRouterActivate(event:any){
     this.activeComponent=event
  }

  lockedBy(event:any){
    this.activeComponent.searchEmited({value:event.target.checked,key:'lockedBy'})
  }

  download(event:string){
    event==='csv'?this.activeComponent.CSV():this.activeComponent.XLS()
  }
}
