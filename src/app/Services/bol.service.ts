import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment } from '../Models/Shipment';
import { APIURL, InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class BOLService {

  Route: string = "Shipment";
  constructor(private http: HttpClient) {
  }
  GetShipmentById(Id: number) {
    return this.http.get(APIURL + this.Route + "/GetShipmentById/" + Id).toPromise();
  }
  CreatShipment(NewShipment: Shipment) {
    return this.http.post(APIURL + this.Route + "/CreateShipment", NewShipment).toPromise()
  }
  UpdateShipment(UpdateShipment: Shipment) {
    return this.http.post(APIURL + this.Route + "/UpdateShipment", UpdateShipment).toPromise()
  }
  DeleteShipment(DeletedShipment: Shipment) {
    return this.http.post(APIURL + this.Route + "/DeleteShipment", DeletedShipment).toPromise()
  }
}
