import { Component } from '@angular/core';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FilterbuttonComponent } from "../filterbutton/filterbutton.component";
import { FooterComponent } from "../footer/footer.component";
import { FiltersidebarComponent } from "../filtersidebar/filtersidebar.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-payout-services',
    standalone: true,
    templateUrl: './payout-services.component.html',
    styleUrl: './payout-services.component.css',
    imports: [InnerheaderComponent, FilterbuttonComponent,RouterOutlet,RouterLink,RouterLinkActive, FooterComponent, FiltersidebarComponent]
})
export class PayoutServicesComponent {

}
