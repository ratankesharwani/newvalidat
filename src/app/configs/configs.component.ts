import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'app-configs',
    standalone: true,
    templateUrl: './configs.component.html',
    styleUrl: './configs.component.css',
    imports: [RouterModule, InnerheaderComponent, FooterComponent]
})
export class ConfigsComponent {
}
