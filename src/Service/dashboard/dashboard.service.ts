import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class dashboardService {
  
  constructor(private http: HttpClient) { }

  idAula!:number;
  NomAula!:string;

  getTempHumedad(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/tempHumedad/'+this.idAula);
  }

  getco2tvoc(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/co2tvoc/'+this.idAula);
  }

  getIntensidadLuminica(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/inteisdadluminica/'+this.idAula);
  }
}