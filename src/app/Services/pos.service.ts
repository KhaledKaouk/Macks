import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { POs } from '../Models/Po-model';

@Injectable({
  providedIn: 'root'
})
export class POsService {

  constructor(private http: HttpClient,) { }

  GetPos() {
    return this.http.get<POs>("https://macksdistribution.com/api/account/getAllPos").toPromise();
  }

  CreatePo(NewPo: POs) {
    return this.http.post("https://macksdistribution.com/api/account/CreatePO", NewPo);
  }

  Uploadfile(formData: FormData, FileName: string) {
    return this.http.post('https://macksdistribution.com/api/account/UploadPO', formData, { 'params': { filename: FileName } });
  }

  UpdatePo(UpdatedPo: POs) {
    return this.http.post("https://macksdistribution.com/api/account/updatepo", UpdatedPo);
  }
  GetProducts() {
    return this.http.get("https://macksdistribution.com/api/account/GetCatalog");
  }

  DeletePo(Po: POs) {
    Po.deleted = confirm("Are you Sure you Want To Delete this Po?")
    return this.http.post("https://macksdistribution.com/api/account/updatepo", Po);
  }
}
