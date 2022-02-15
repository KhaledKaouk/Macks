import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { POs } from '../Models/Po-model';
import { APIURL } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class POsService {

  Route: string = "Po"
  constructor(private http: HttpClient,) { }

  FindPoFileName(Po: POs) {
    return this.http.post(APIURL + this.Route + '/FindPoFileName', Po).toPromise();
  }

  GetPos() {
    return this.http.get<POs>(APIURL + this.Route + "/getAllPos").toPromise();
  }

  CreatePo(NewPo: POs) {
    return this.http.post(APIURL + this.Route + "/CreatePO", NewPo);
  }

  Uploadfile(formData: FormData, FileName: string) {
    return this.http.post(APIURL + this.Route + '/UploadPO', formData, { 'params': { filename: FileName } });
  }

  UpdatePo(UpdatedPo: POs) {
    return this.http.post(APIURL + this.Route + "/updatepo", UpdatedPo)
  }
  GetProducts() {
    return this.http.get(APIURL + this.Route + "/GetCatalog");
  }

  DeletePo(Po: POs) {
    Po.deleted = confirm("Are you Sure you Want To Delete this Po?")
    return this.http.post(APIURL + this.Route + "/deletepofromdb", Po);
  }
  UpdatePosBulk(Pos: POs[]) {
    return this.http.post(APIURL + this.Route + "/UpdatePosStatusAndDates", Pos)
  }
}
