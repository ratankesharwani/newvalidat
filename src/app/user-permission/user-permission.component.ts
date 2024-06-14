import { Component } from '@angular/core';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-user-permission',
    standalone: true,
    templateUrl: './user-permission.component.html',
    styleUrl: './user-permission.component.css',
    imports: [InnerheaderComponent, FooterComponent,RouterOutlet]
})
export class UserPermissionComponent {

}
