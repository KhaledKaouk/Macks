import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../Models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  LogIn(UserName: string, Password: string){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    let grant_type: string= "password";
    let username: string = UserName;
    let password: string = Password;
    
    let body = `grant_type=${grant_type}&username=${username}&password=${password}`;
    sessionStorage.setItem("username",UserName)
    
    return this.http.post<Token>("https://macksdistribution.com/token",body,{headers: headers});
  }

  GetToken(){
    return sessionStorage.getItem('token');
  }


}
