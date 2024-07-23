import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import { AdminService } from './Service/admin.service';
import { LocalStorageService } from './Service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiGuard implements CanActivate {
  userAccess: FormGroup
  queueParseData: any
  access: any

  constructor(private service: AdminService,
              private router: Router,
              public dialog: MatDialog,
              private localStorage:LocalStorageService) {
    const queueData: any = this.localStorage.getItem("data")
    this.queueParseData = JSON.parse(queueData)

    this.userAccess = new FormGroup({
      request: new FormGroup({
        module: new FormControl('COMPLIANCE'),
        subModule: new FormControl('ROUTER_PASS'),
        body: new FormGroup({
          userId: new FormControl(this.queueParseData?.USER_ID),
          companyId: new FormControl(this.queueParseData?.COMPANY_ID),
          router: new FormControl()
        })
      })
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // this.userAccess.controls['request'].value.body.router = window.location.hash.split("/")[2];
    if (typeof window !== 'undefined') {
      this.userAccess.controls['request'].value.body.router = window.location.hash.split("/")[2];
    }
    this.userAccess.controls['request'].value.body.userId=this.queueParseData?.USER_ID
    this.userAccess.controls['request'].value.body.companyId=this.queueParseData?.COMPANY_ID
    return this.service.apiCheck(this.userAccess.value).pipe(
      map((res) => {
        return !!res;
      })
    )
  }
}
