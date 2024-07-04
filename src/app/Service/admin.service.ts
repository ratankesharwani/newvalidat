import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, of, catchError, map } from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import { AuthrizationAlertComponent } from '../authrization-alert/authrization-alert.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private complianceUrl = environment.complianceUrl
  private bankInfoHubUrl =environment.bankInfoHubUrl
  private externalBankInfoUrl = "https://paragonuat.xend.com/paragongateway/externalbankinfo";

  constructor(private http: HttpClient,  public dialog: MatDialog ) { }

  serviceDetails(data:any):Observable<any>{
    return this.http.post(this.complianceUrl,data)
  }
  menuPanel(data:any):Observable<any>{
    return this.http.post(this.complianceUrl,data)
  }
  login(data:any):Observable<any>{
   return this.http.post(this.complianceUrl,data);
  }
  apiCheck(data:any):Observable<any>{
    return this.http.post(this.complianceUrl,data).pipe(
      switchMap((res)=>{
        if(res){
          return of(true)
        }else {
          return of(false)
        }
      }),catchError((e)=>{
        if(localStorage.getItem('tabAllow') && window.location.hash.split("/")[1]==='tab-dash'){
            return of(true)
        }else {
          const dialogRef = this.dialog.open(AuthrizationAlertComponent, {
            disableClose: true,
            height: '100%',
            width: '100%',
            data:"Unauthorized action detected"
          });
          return dialogRef.afterClosed().pipe(map(choice => {
          }));
          return of(false);
        }
      })
    )
  }
  payInList(data:any):Observable<any>{
    return this.http.post<any>(this.complianceUrl,data);
  }
  updateBlackListMaster(data:any):Observable<any>{
    return  this.http.put(this.complianceUrl,data)
  }
  unAllocatedPayIn(data:any):Observable<any>{
    return this.http.post(this.bankInfoHubUrl,data);
  }
  createWhitelist(data:any):Observable<any>{
    return this.http.post(this.complianceUrl,data);
  }
  updateBlackListMasterDetails(data:any):Observable<any>{
    return  this.http.put(this.complianceUrl,data)
  }
  bankMaster(data:any):Observable<any>{
    return this.http.post(this.bankInfoHubUrl,data);
  }
  bankAccount(data:any):Observable<any>{
    return  this.http.post(this.bankInfoHubUrl , data);
  }
  bankMasterInfo(data:any):Observable<any> {
    return this.http.post(this.bankInfoHubUrl, data);
  }
  bankAccountBalance(data:any):Observable<any>{
    return this.http.post(this.externalBankInfoUrl, data);
  }
  loggedIn: boolean = false;
  isLoggedIn() {
    return this.loggedIn;
  }
  isLoggedin(){
    return localStorage.getItem("isLoggedIn")
  }
  uploadFile1(file:any):Observable<any>{
    let Header = new HttpHeaders();
    Header.append('Content-Type', 'multipart/form-data');
    return this.http.post(this.complianceUrl+"/upload",file,{headers:Header})
  }
  allDocuments(data:any):Observable<any>{
    return this.http.post(this.complianceUrl,data)
  }
  downloadDocuments(data:any){
    window.location.href=`${this.complianceUrl}/download?fileName=${data}`
  }
}

