import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }

  IniciarSesion(Mail:string,Contrasenia:string):Observable<any>{
    let body={
      Mail: Mail,
      Contrasenia : Contrasenia,
    };
    return this.http.post<any>(URL_ENDPOINT+'usuario/session',body);
  }
}