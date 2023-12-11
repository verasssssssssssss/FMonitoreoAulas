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

  getCursos(IdSede: number): Observable<any> {
    const body = { IdSede:IdSede};
    return this.http.get<any>(URL_ENDPOINT + 'curso/obtener/xsede/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  crearReserva( DiaClases:number,FechaLimite:Date,IdCurso:number,IdAula:number,IdSede:number,IdBloqueInicio:number,IdBloqueFin:number): Observable<any> {
    const body = { DiaClases	: DiaClases, FechaLimite: FechaLimite, IdCurso: IdCurso, IdAula: IdAula, IdSede: IdSede, IdBloqueInicio:IdBloqueInicio, IdBloqueFin:IdBloqueFin};
    return this.http.post(URL_ENDPOINT + 'reserva/crear/?token='+this.loginService.datoLocalStorage.token, body);
  }

  eliminarReservaBloque(IdReserva: number,IdBloque: number): Observable<any> {
    const body = { IdReserva:IdReserva,IdBloque:IdBloque};
    return this.http.delete(URL_ENDPOINT + 'reserva/eliminar/bloque/?token='+this.loginService.datoLocalStorage.token, {params:body});
  }
  eliminarReserva(IdReserva: number): Observable<any> {
    const body = { IdReserva:IdReserva};
    return this.http.delete(URL_ENDPOINT + 'reserva/eliminar/?token='+this.loginService.datoLocalStorage.token, {params:body});
  }
}