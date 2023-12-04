import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpClient, private loginService:LoginService) { }

  getNotifiacionDesuso(IdSede: number): Observable<any> {
    const body = {IdSede:IdSede };
    return this.http.post(URL_ENDPOINT + 'alerta/obtener/?token='+this.loginService.datoLocalStorage.token,body);
  }

  getDatosAulaDesuso(Dia: number,IdAula: number,IdBloque: number): Observable<any> {
    const body = {Dia:Dia, IdAula:IdAula, IdBloque:IdBloque};
    return this.http.get(URL_ENDPOINT + 'reporte/datos/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getDatosCorreo(IdSede: number): Observable<any> {
    const body = { IdSede:IdSede };
    return this.http.get(URL_ENDPOINT + 'correo/Obtener/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getCarrerasSede(IdSede: number): Observable<any> {
    const body = { IdSede:IdSede };
    return this.http.get(URL_ENDPOINT + 'carreras/listado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  agregarReporte(IdCurso: number, IdCarrera: number, IdUsuario: number, IdAula: number, IdDatos: number): Observable<any> {
    const body = { IdCurso:IdCurso,IdCarrera: IdCarrera, IdUsuario: IdUsuario,IdAula: IdAula,IdDatos: IdDatos};
    return this.http.post(URL_ENDPOINT + 'reporte/crear/?token='+this.loginService.datoLocalStorage.token, body);
  }
  
  enviarCorreo(to:string, NomDirector: string, ApeDirector: string, NomSede: string, NomCurso:string, Codigo:string, FechaReporte:string, NomCarrera:string, NomEncargado:string,NomAula:string, CapturaFotografica:string): Observable<any> {
    const body = {  to: to, NomDirector:NomDirector, ApeDirector:ApeDirector, NomSede:NomSede, NomCurso:NomCurso, Codigo:Codigo, FechaReporte:FechaReporte, NomCarrera:NomCarrera, NomEncargado:NomEncargado,NomAula:NomAula, CapturaFotografica:CapturaFotografica };
    return this.http.post(URL_ENDPOINT + 'EnviarCorreo/?token='+this.loginService.datoLocalStorage.token, body);
  }

  validarAlerta(IdDatos:number,validacion:number): Observable<any> {
    const body = {  IdDatos:IdDatos, validacion:validacion };
    return this.http.put(URL_ENDPOINT + 'alerta/validar/?token='+this.loginService.datoLocalStorage.token, body);
  }
}