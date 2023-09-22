import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http : HttpClient) { }

  getCiudad(IdCiudad:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'sede/obtener/'+IdCiudad);
  }

  getSedes(IdCiudad:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'sede/listado/'+IdCiudad);
  }

  getAreasDeTrabajo(IdSede:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'area/listado/'+IdSede);
  }

  getAulas(IdAreasDeTrabajo:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'aula/listado/'+IdAreasDeTrabajo);
  }

  asignarAreasDeTrabajo(IdAreasDeTrabajo:number,IdUsuario:number):Observable<any>{
    const body = { IdUsuario: IdUsuario};
    return this.http.put(URL_ENDPOINT+'area/asignar/'+IdAreasDeTrabajo,body);
  }

  delegarAreasDeTrabajo(IdAreasDeTrabajo:number):Observable<any>{
    const body = { IdUsuario:null};
    return this.http.put(URL_ENDPOINT+'area/delegar/'+IdAreasDeTrabajo,body);
  }

  eliminarAula(IdAula:number):Observable<any>{
    const body = { Visible:0};
    return this.http.put(URL_ENDPOINT+'aula/eliminar/'+IdAula,body);
  }

  eliminarAreasDeTrabajo(IdArea:number):Observable<any>{
    const body = { Visible:0};
    return this.http.put(URL_ENDPOINT+'area/eliminar/'+IdArea,body);
  }
  
  getEncargadosSede(IdSede:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'encargado/listado/'+IdSede);
  }

 editarAula(IdAula:number,NomAula:string,CantidadAlumnos:number):Observable<any>{
    const body = { NomAula:NomAula, CantidadAlumnos	:CantidadAlumnos};
    return this.http.put(URL_ENDPOINT+'aula/editar/'+IdAula,body);
  }

  agregarAula(IdArea:number,NomAula:string,CantidadAlumnos:number):Observable<any>{
    const body = { IdArea:IdArea,NomAula:NomAula, CantidadAlumnos	:CantidadAlumnos};
    return this.http.post(URL_ENDPOINT+'aula/crear',body);
  }

  editarAreaDeTrabajo(NomArea:string,IdArea:number):Observable<any>{
    const body = { NomArea:NomArea};
    return this.http.put(URL_ENDPOINT+'area/editar/'+IdArea,body);
  }

  agregarAreaDeTrabajo(IdSede:number,NomArea:string):Observable<any>{
    const body = { IdSede:IdSede,NomArea:NomArea};
    return this.http.post(URL_ENDPOINT+'area/crear',body);
  }

  eliminarEncargado(IdUsuario:number):Observable<any>{
    const body = {};
    return this.http.put(URL_ENDPOINT+'encargado/eliminar/'+IdUsuario,body);
  }

  getEncargadoObtener(IdUsuario:number):Observable<any>{
    return this.http.get(URL_ENDPOINT+'encargado/obtener/'+IdUsuario);
  }
}

