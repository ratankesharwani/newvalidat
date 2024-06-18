import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import { AdminService } from './Service/admin.service';
import { AuthrizationAlertComponent } from './authrization-alert/authrization-alert.component';

@Injectable({
  providedIn: 'root'
})
export class OtpValidationGuard implements CanActivate {
  constructor(public dialog: MatDialog,private router:Router,private service :AdminService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!(localStorage.getItem("forgotData")) && !(localStorage.getItem("firstTimeLogin")==="true"))
    {
      console.log("okok")
      const dialogRef = this.dialog.open(AuthrizationAlertComponent, {
        disableClose: true,
        height: '100%',
        width: '100%',
        data:'You need to verify otp first'
      },);
      return dialogRef.afterClosed().pipe(map(choice => {
        if(this.service.isLoggedin()==="true" || localStorage.getItem('forgotData')){
          this.router.navigate(['/verify-otp'])
        }else {
          this.router.navigate(['/'])
        }
        return choice;
      }));
    }

    else if(localStorage.getItem("firstTimeLogin") || (localStorage.getItem("forgotData"))){
      return true
    }

    else if((localStorage.getItem("OtpValid")==="true")){
      const dialogRef = this.dialog.open(AuthrizationAlertComponent, {
        disableClose: true,
        height: '100%',
        width: '100%',
        data:'Not Allowed'
      });
      return dialogRef.afterClosed().pipe(map(choice => {
        return false;
      }));
    }
    else if(!localStorage.getItem('forgotData')){
      console.log("inside else if")
      const dialogRef = this.dialog.open(AuthrizationAlertComponent, {
        disableClose: true,
        height: '100%',
        width: '100%',
        data:'You are already logged in'
      });
      return dialogRef.afterClosed().pipe(map(choice => {
        return false;
      }));
    }
    else
    {
      console.log("inside else")
      return true;
    }
  }
}
