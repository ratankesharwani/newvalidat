import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InnerheaderComponent } from './innerheader/innerheader.component';
import { FooterComponent } from './footer/footer.component';
import { FilterbuttonComponent } from './filterbutton/filterbutton.component';
import { FiltersidebarComponent } from './filtersidebar/filtersidebar.component';
import { isPlatformBrowser } from '@angular/common';
import { PaymentinComponent } from "./paymentin/paymentin.component";
import { PaymentoutComponent } from "./paymentout/paymentout.component";
import { AddserviceruleComponent } from "./addservicerule/addservicerule.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [HttpClientModule, RouterOutlet, InnerheaderComponent, FooterComponent, FilterbuttonComponent, FiltersidebarComponent, PaymentinComponent, PaymentoutComponent, AddserviceruleComponent]
})
export class AppComponent {
  private isBrowser: boolean;
  toggleButton:boolean=false

  title = 'newvalidat';
  constructor(private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {this.isBrowser = isPlatformBrowser(this.platformId);}

  click(){
    if (this.isBrowser) {
        this.toggleButton=true
        this.renderer.addClass(document.body, 'right-bar-enabled');
    }
  }
  ngOnDestroy() {
    if (this.isBrowser) {
      this.renderer.removeClass(document.body, 'right-bar-enabled');
    }
  }
}
