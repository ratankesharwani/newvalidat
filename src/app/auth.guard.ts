import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import { AdminService } from './Service/admin.service';
import { AuthrizationAlertComponent } from './authrization-alert/authrization-alert.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  message='Please login first'
  constructor(private service :AdminService,
              public dialog: MatDialog,
              private router :Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!(this.service.isLoggedin()==="true"))
    {
      if(localStorage.getItem('forgotData') || (localStorage.getItem("OtpValid")==="true")){
        this.message="Please verify otp first"
      }
      const dialogRef = this.dialog.open(AuthrizationAlertComponent, {
        disableClose: true,
        height: '100%',
        width: '100%',
        data:this.message
      });
      return dialogRef.afterClosed().pipe(map(choice => {
        if(localStorage.getItem('forgotData') || (localStorage.getItem("OtpValid")==="true")){
          this.router.navigate(['/verify-otp'])
        }else {
          this.router.navigate(['/'])
        }
        return choice;
      }));
    }
    else
    {
      return true;
    }
  }
}
