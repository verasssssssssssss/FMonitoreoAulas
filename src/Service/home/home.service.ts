import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from 'src/Clases/Usuarios';
import { URL_ENDPOINT } from 'src/Config/config';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  datoLocalStorage!: Usuarios;
  
  constructor(private http: HttpClient, private loginService:LoginService) { }

  getCiudad(IdCiudad: number): Observable<any> {
    const body = { IdCiudad: IdCiudad };
    return this.http.get<any>(URL_ENDPOINT + 'sede/obtener/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getSedes(IdCiudad: number): Observable<any> {
    const body = { IdCiudad: IdCiudad };
    return this.http.get<any>(URL_ENDPOINT + 'sede/listado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getAreasDeTrabajo(IdSede: number): Observable<any> {
    const body = { IdSede:IdSede};
    return this.http.get<any>(URL_ENDPOINT + 'area/listado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getAulas(IdAreasDeTrabajo: number): Observable<any> {
    const body = { IdAreasDeTrabajo:IdAreasDeTrabajo};
    return this.http.get<any>(URL_ENDPOINT + 'aula/listado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  eliminarAula(IdAula: number): Observable<any> {
    const body = { Visible: 0,IdAula:IdAula };
    return this.http.put(URL_ENDPOINT + 'aula/eliminar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  eliminarAreasDeTrabajo(IdArea: number): Observable<any> {
    const body = { Visible: 0,IdArea:IdArea};
    return this.http.put(URL_ENDPOINT + 'area/eliminar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  editarAula(IdAula: number, NomAula: string, CantidadAlumnos: number): Observable<any> {
    const body = { NomAula: NomAula, CantidadAlumnos: CantidadAlumnos,IdAula:IdAula };
    return this.http.put(URL_ENDPOINT + 'aula/editar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  agregarAula(IdArea: number, NomAula: string, CantidadAlumnos: number): Observable<any> {
    const body = { IdArea: IdArea, NomAula: NomAula, CantidadAlumnos: CantidadAlumnos };
    return this.http.post(URL_ENDPOINT + 'aula/crear/?token='+this.loginService.datoLocalStorage.token, body);
  }

  editarAreaDeTrabajo(NomArea: string, IdArea: number): Observable<any> {
    const body = { NomArea: NomArea,IdArea:IdArea };
    return this.http.put(URL_ENDPOINT + 'area/editar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  agregarAreaDeTrabajo(IdSede: number, NomArea: string): Observable<any> {
    const body = { IdSede: IdSede, NomArea: NomArea };
    return this.http.post(URL_ENDPOINT + 'area/crear/?token='+this.loginService.datoLocalStorage.token, body);
  }

  eliminarEncargado(IdUsuario: number): Observable<any> {
    const body = {IdUsuario:IdUsuario};
    return this.http.put(URL_ENDPOINT + 'encargado/eliminar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  getusuario(IdUsuario: number): Observable<any> {
    const body = {IdUsuario:IdUsuario};
    return this.http.get(URL_ENDPOINT + 'usuario/obtener/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getEncargado(IdCiudad: number): Observable<any> {
    const body = {IdCiudad:IdCiudad};
    return this.http.get(URL_ENDPOINT + 'encargado/obtener/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  agregarEncargado(NomUsuario: string,ApeUsuario: string,Mail: string,Contrasenia: string,Fotografia: string,IdCiudad : number): Observable<any> {
    const body = {
      NomUsuario:NomUsuario,
      ApeUsuario:ApeUsuario,
      Mail:Mail,
      Contrasenia:Contrasenia,
      IdCiudad:IdCiudad,
      Fotografia:Fotografia,
    };
    return this.http.post(URL_ENDPOINT + 'encargado/crear/?token='+this.loginService.datoLocalStorage.token, body);
  }

  editarEncargado(IdUsuario: number,NomUsuario: string,ApeUsuario: string,Mail: string,Contrasenia: string,Fotografia: string,IdSede: number): Observable<any> {
    const body = {
      IdUsuario:IdUsuario,
      NomUsuario:NomUsuario,
      ApeUsuario:ApeUsuario,
      Mail:Mail,
      Contrasenia:Contrasenia,
      IdSede:IdSede,
      Fotografia:Fotografia,
    };
    return this.http.put(URL_ENDPOINT + 'encargado/editar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  editarUsuario(IdUsuario: number,NomUsuario: string,ApeUsuario: string,Fotografia: string,Mail: string,Contrasenia: string): Observable<any> {
    const body = {
      IdUsuario:IdUsuario,
      NomUsuario:NomUsuario,
      ApeUsuario:ApeUsuario,
      Fotografia:Fotografia,
      Mail:Mail,
      Contrasenia:Contrasenia,
    };
    return this.http.put(URL_ENDPOINT + 'usuario/editar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  cambiarSedeEncargado(IdUsuario: number,IdSede: number): Observable<any> {
    const body = {
      IdUsuario:IdUsuario,
      IdSede:IdSede
    };
    return this.http.put(URL_ENDPOINT + 'usuario/cambiar/sede/?token='+this.loginService.datoLocalStorage.token, body);
  }
}