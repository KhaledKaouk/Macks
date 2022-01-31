import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment } from '../Models/Shipment';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class BOLService {

  ApiUrl = "https://macksdis.com/Shipment";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiUrl = "http://localhost:5000/Shipment"
  }
  GetShipmentById(Id: number) {
    return this.http.get(this.ApiUrl + "/GetShipmentById/" + Id).toPromise();
  }
  CreatShipment(NewShipment: Shipment) {
    return this.http.post(this.ApiUrl + "/CreateShipment", NewShipment).toPromise()
  }
  UpdateShipment(UpdateShipment: Shipment) {
    return this.http.post(this.ApiUrl + "/UpdateShipment", UpdateShipment).toPromise()
  }
  DeleteShipment(DeletedShipment: Shipment) {
    return this.http.post(this.ApiUrl + "/DeleteShipment", DeletedShipment).toPromise()
  }
}
