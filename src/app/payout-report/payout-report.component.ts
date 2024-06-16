import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payout-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payout-report.component.html',
  styleUrl: './payout-report.component.css'
})
export class PayoutReportComponent {
  allServicesForm: FormGroup;
  allCheckServices:any
  constructor(private service: AdminService,private router :Router) {
    this.allServicesForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ALL_PAYOUT_SERVICE_REPORTS'),
        body: new FormGroup({})
      })
    });
  }
  ngOnInit(){
    this.service.menuPanel(this.allServicesForm.value).subscribe(res=>{
      this.allCheckServices=res
    })
  }
  onRoute(name:any,route:any){
     this.router.navigate(['/graph-report/'+name],{queryParams:{route:route}})
  }
}

