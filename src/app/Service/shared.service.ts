import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private node:boolean=false;
  get node$(){return this.node}
  addNode(data:any){this.node=data}
  private lock:boolean=false;
  get lock$(){return this.lock}
  addLock(data:any){this.lock=data}

  public payin = new BehaviorSubject(null);
  public addPayin(data:any): void {
    this.payin.next(data);
  }
  public getPayin(): Observable<any>{
    return this.payin;
  }
  public payout = new BehaviorSubject(null);
  public addPayout(data:any): void {
    this.payout.next(data);
  }
  public getPayout(): Observable<any>{
    return this.payout;
  }
}
