import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { port } from '../Models/port';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  ApiURL: string = "https://macksdis.com/Port";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiURL = "http://localhost:5000/Port"
   }

  GetPorts(){
    return this.http.get(this.ApiURL + '/getports').toPromise()
  }
  CreatePort(NewPort: port){
    return this.http.post(this.ApiURL + '/createport', NewPort).toPromise()
  }
  UpdatePort(UpdatedPort: port){
    return this.http.post(this.ApiURL + '/updateport',UpdatedPort).toPromise()
  }
  DeletePort(DeletedPort: port){
    this.http.post(this.ApiURL + '/deleteport',DeletedPort).toPromise();
  }
}
