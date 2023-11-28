import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class dashboardService {
  
  constructor(private http: HttpClient) { }

  getTempHumedad(token:string): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/tempHumedad');
  }

  getco2tvoc(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/co2tvoc');
  }

  getIntensidadLuminica(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/inteisdadluminica');
  }
}