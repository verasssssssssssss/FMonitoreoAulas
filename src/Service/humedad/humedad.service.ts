import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class HumedadService {
  
  constructor(private http: HttpClient) { }

  getTempHumedad(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/tempHumedad');
  }
}