import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http : HttpClient) { }

  getCiudad(IdCiudad:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'sede/obtener/'+IdCiudad);
  }

  getSedes(IdCiudad:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'sede/listado/'+IdCiudad);
  }

  getAreasDeTrabajo(IdSede:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'area/listado/'+IdSede);
  }

  getAulas(AreasDeTrabajo:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'aula/listado/'+AreasDeTrabajo);
  }
}
