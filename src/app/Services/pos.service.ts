import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { POs } from '../Models/Po-model';
import { InDevMode } from '../Utilities/Common';

@Injectable({
  providedIn: 'root'
})
export class POsService {

   ApiURL: string = "https://macksdistribution.com/api/account";
  constructor(private http: HttpClient,) {
    if (InDevMode) this.ApiURL = "http://localhost:5000"
   }

  GetPos() {
    return this.http.get<POs>(this.ApiURL + "/getAllPos").toPromise();
  }

  CreatePo(NewPo: POs) {
    return this.http.post(this.ApiURL + "/CreatePO", NewPo);
  }

  Uploadfile(formData: FormData, FileName: string) {
    return this.http.post(this.ApiURL + '/UploadPO', formData, { 'params': { filename: FileName } });
  }

  UpdatePo(UpdatedPo: POs) {
    return this.http.post(this.ApiURL + "/updatepo", UpdatedPo);
  }
  GetProducts() {
    return this.http.get(this.ApiURL + "/GetCatalog");
  }

  DeletePo(Po: POs) {
    Po.deleted = confirm("Are you Sure you Want To Delete this Po?")
    return this.http.post(this.ApiURL + "/deletepofromdb", Po);
  }
}
