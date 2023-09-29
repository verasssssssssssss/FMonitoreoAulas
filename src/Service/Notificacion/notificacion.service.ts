import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpClient) { }

  agregarNotifiacion(IdUsuario: number): Observable<any> {
    return this.http.get(URL_ENDPOINT + 'reporte/obtener/'+IdUsuario);
  }
}