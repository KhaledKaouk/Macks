import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dealers } from '../Models/Dealers';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class DealersService {

  ApiUrl = "http://macksdis.com/Dealer";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiUrl = "http://localhost:5000/Dealer"
   }

  CreateDealer(NewDealer: Dealers){
    return this.http.post(this.ApiUrl + "/createdealer",NewDealer).toPromise();
  }
  GetAllDealers(){
    return this.http.get(this.ApiUrl + "/getdealers").toPromise();
  }
  UpdateDealer(UpdatedDealer: Dealers){
    return this.http.post(this.ApiUrl + "/updatedealer", UpdatedDealer).toPromise();
  }
}
