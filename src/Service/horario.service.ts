import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient) { }

  getAulas(IdSede: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'aula/listado/sede/' + IdSede);
  }

  getReservas(IdAula: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'reserva/obtener/poraula/' + IdAula);
  }

  getBloques(IdReserva: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'bloque/obtener/' + IdReserva);
  }

}
