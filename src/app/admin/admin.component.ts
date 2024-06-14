import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FilterbuttonComponent } from "../filterbutton/filterbutton.component";
import { FooterComponent } from "../footer/footer.component";
import { FiltersidebarComponent } from "../filtersidebar/filtersidebar.component";

@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css',
    imports: [RouterOutlet, InnerheaderComponent, FilterbuttonComponent, FooterComponent, FiltersidebarComponent]
})
export class AdminComponent {

}
