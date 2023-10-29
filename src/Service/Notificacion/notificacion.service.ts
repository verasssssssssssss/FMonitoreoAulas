import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpClient) { }

  getNotifiacionDesuso(IdSede: number): Observable<any> {
    const body = {  DiaClases:1, IdSede:IdSede };
    return this.http.post(URL_ENDPOINT + 'reporte/obtener',body);
  }

  getDatosCorreo(IdSede: number): Observable<any> {
    return this.http.get(URL_ENDPOINT + 'correo/Obtener/'+IdSede);
  }

  getCarrerasSede(IdSede: number): Observable<any> {
    return this.http.get(URL_ENDPOINT + 'carreras/listado/'+IdSede);
  }

  agregarReporte(IdCurso: number,FechaReporte: Date, IdCarrera: number, IdUsuario: number, IdAula: number, IdDatos: number): Observable<any> {
    console.log(FechaReporte);
    const body = { IdCurso:IdCurso,FechaReporte: FechaReporte,IdCarrera: IdCarrera, IdUsuario: IdUsuario,IdAula: IdAula,IdDatos: IdDatos};
    return this.http.post(URL_ENDPOINT + 'reporte/crear', body);
  }
  
  enviarCorreo(to:string, NomDirector: string, ApeDirector: string, NomSede: string, NomCurso:string, Codigo:string, FechaReporte:string, NomCarrera:string, NomEncargado:string,NomAula:string, CapturaFotografica:string): Observable<any> {
    const body = {  to: to, NomDirector:NomDirector, ApeDirector:ApeDirector, NomSede:NomSede, NomCurso:NomCurso, Codigo:Codigo, FechaReporte:FechaReporte, NomCarrera:NomCarrera, NomEncargado:NomEncargado,NomAula:NomAula, CapturaFotografica:CapturaFotografica };
    return this.http.post(URL_ENDPOINT + 'EnviarCorreo', body);
  }

  validarAlerta(IdDatos:number,validacion:number): Observable<any> {
    const body = {  IdDatos:IdDatos, validacion:validacion };
    return this.http.put(URL_ENDPOINT + 'alerta/validar', body);
  }
}