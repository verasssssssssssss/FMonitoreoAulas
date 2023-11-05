import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from 'src/Clases/Usuarios';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  datoLocalStorage!: Usuarios;
  
  constructor(private http: HttpClient) { }

  getCiudad(IdCiudad: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'sede/obtener/' + IdCiudad);
  }

  getSedes(IdCiudad: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'sede/listado/' + IdCiudad);
  }

  getAreasDeTrabajo(IdSede: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'area/listado/' + IdSede);
  }

  getAulas(IdAreasDeTrabajo: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'aula/listado/' + IdAreasDeTrabajo);
  }

  eliminarAula(IdAula: number): Observable<any> {
    const body = { Visible: 0 };
    return this.http.put(URL_ENDPOINT + 'aula/eliminar/' + IdAula, body);
  }

  eliminarAreasDeTrabajo(IdArea: number): Observable<any> {
    const body = { Visible: 0 };
    return this.http.put(URL_ENDPOINT + 'area/eliminar/' + IdArea, body);
  }

  editarAula(IdAula: number, NomAula: string, CantidadAlumnos: number): Observable<any> {
    const body = { NomAula: NomAula, CantidadAlumnos: CantidadAlumnos };
    return this.http.put(URL_ENDPOINT + 'aula/editar/' + IdAula, body);
  }

  agregarAula(IdArea: number, NomAula: string, CantidadAlumnos: number): Observable<any> {
    const body = { IdArea: IdArea, NomAula: NomAula, CantidadAlumnos: CantidadAlumnos };
    return this.http.post(URL_ENDPOINT + 'aula/crear', body);
  }

  editarAreaDeTrabajo(NomArea: string, IdArea: number): Observable<any> {
    const body = { NomArea: NomArea };
    return this.http.put(URL_ENDPOINT + 'area/editar/' + IdArea, body);
  }

  agregarAreaDeTrabajo(IdSede: number, NomArea: string): Observable<any> {
    const body = { IdSede: IdSede, NomArea: NomArea };
    return this.http.post(URL_ENDPOINT + 'area/crear', body);
  }

  eliminarEncargado(IdUsuario: number): Observable<any> {
    const body = {};
    return this.http.put(URL_ENDPOINT + 'encargado/eliminar/' + IdUsuario, body);
  }

  getusuario(IdUsuario: number): Observable<any> {
    return this.http.get(URL_ENDPOINT + 'usuario/obtener/' + IdUsuario);
  }

  agregarEncargado(NomUsuario: string,ApeUsuario: string,Mail: string,Contrasenia: string,Fotografia: string,IdSede: number): Observable<any> {
    const body = {
      NomUsuario:NomUsuario,
      ApeUsuario:ApeUsuario,
      Mail:Mail,
      Contrasenia:Contrasenia,
      IdSede:IdSede,
      Fotografia:Fotografia,
    };
    return this.http.post(URL_ENDPOINT + 'encargado/crear', body);
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
    return this.http.put(URL_ENDPOINT + 'encargado/editar/' + body.IdUsuario, body);
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
    return this.http.put(URL_ENDPOINT + 'usuario/editar', body);
  }

  quitarEncargado(IdUsuario: number): Observable<any> {
    const body = {};
    return this.http.put(URL_ENDPOINT + 'area/quitar/' + IdUsuario, body);
  }

  cambiarSedeEncargado(IdUsuario: number,IdSede: number): Observable<any> {
    const body = {
      IdUsuario:IdUsuario,
      IdSede:IdSede
    };
    return this.http.put(URL_ENDPOINT + 'usuario/cambiar/sede', body);
  }
}