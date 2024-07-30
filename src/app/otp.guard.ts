import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import { AdminService } from './Service/admin.service';
import { AuthrizationAlertComponent } from './authrization-alert/authrization-alert.component';

@Injectable({
  providedIn: 'root'
})
export class OtpGuard implements CanActivate {
  constructor(public dialog: MatDialog,private router:Router,private service :AdminService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!(localStorage.getItem("OtpValid")))
    {
      const dialogRef = this.dialog.open(AuthrizationAlertComponent, {
        disableClose: true,
        height: '100%',
        width: '100%',
        data:'This action in not allowed here'
      },);
      return dialogRef.afterClosed().pipe(map(choice => {
        if(this.service.isLoggedin()==="true"){
          console.log(window.location.hash.split("/"))
          this.router.navigate(['/dashboard/graph'])
        }else {
          this.router.navigate(['/'])
        }
        return choice;
      }));
    }else {
      return true
    }
  }
}
