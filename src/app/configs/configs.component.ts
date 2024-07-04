import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InnerheaderComponent } from "../innerheader/innerheader.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FilterbuttonComponent } from "../filterbutton/filterbutton.component";
import { BlacklisttypeComponent } from '../blacklisttype/blacklisttype.component';

@Component({
    selector: 'app-configs',
    standalone: true,
    templateUrl: './configs.component.html',
    styleUrl: './configs.component.css',
    imports: [RouterModule, InnerheaderComponent,CommonModule, FooterComponent, FilterbuttonComponent]
})
export class ConfigsComponent {
    private isBrowser: boolean;
    toggleButton:boolean=false
    activeComponent:any
    disableSearch:boolean=false
  
    title = 'newvalidat';
    constructor(private renderer: Renderer2,private route :ActivatedRoute,
      @Inject(PLATFORM_ID) private platformId: any
      ) {this.isBrowser = isPlatformBrowser(this.platformId);}
      ngOnInit(){
       
      }
  
    click(){
      if (this.isBrowser) {
          this.toggleButton=true
          if(this.activeComponent instanceof BlacklisttypeComponent){
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
       this.route.firstChild?.data.subscribe(data => {
        this.disableSearch = data['disableSearch'];
      });
    }
  }
  