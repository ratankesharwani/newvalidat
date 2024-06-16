import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payin-report',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './payin-report.component.html',
  styleUrl: './payin-report.component.css'
})
export class PayinReportComponent {
  allServicesForm: FormGroup;
  allCheckServices:any
  constructor(private service: AdminService,private router :Router) {
    this.allServicesForm = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ALL_SERVICE_REPORTS'),
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

