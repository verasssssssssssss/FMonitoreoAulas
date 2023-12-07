import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient, private loginService:LoginService) { }

  getAulas(IdSede: number): Observable<any> {
    const body = { IdSede:IdSede };
    return this.http.get<any>(URL_ENDPOINT + 'aula/listado/sede/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getReservas(IdAula: number): Observable<any> {
    const body = { IdAula:IdAula};
    return this.http.get<any>(URL_ENDPOINT + 'reserva/poraula/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getBloques(IdReserva: number): Observable<any> {
    const body = { IdReserva:IdReserva};
    return this.http.get<any>(URL_ENDPOINT + 'bloque/obtener/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

}
