import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dealers } from '../Models/Dealers';
import { APIURL, InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class DealersService {

  Route: string = "Dealer";
  constructor(private http: HttpClient) { }

  CreateDealer(NewDealer: Dealers) {
    return this.http.post(APIURL + this.Route + "/createdealer", NewDealer).toPromise();
  }
  GetAllDealers() {
    return this.http.get(APIURL + this.Route + "/getdealers").toPromise();
  }
  UpdateDealer(UpdatedDealer: Dealers) {
    return this.http.post(APIURL + this.Route + "/updatedealer", UpdatedDealer).toPromise();
  }
}
