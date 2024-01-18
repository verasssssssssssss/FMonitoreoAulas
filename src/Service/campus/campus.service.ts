import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { URL_ENDPOINT } from 'src/Config/config';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  
  sedes!: Sedes[];
  NomSedeActual!: string;
  AcroSedeActual!: string;
  NomCiudad!: string;
  IdSede!: number;
  
  booleanhome: boolean = false;

  constructor(private http: HttpClient, private loginService:LoginService) { }


  private triggerMethodSubject = new Subject<void>();

  triggerMethod$ = this.triggerMethodSubject.asObservable();

  triggerMethod() {   
    console.log(this.IdSede)
    this.triggerMethodSubject.next();
  }

  getCiudad(IdCiudad: number): Observable<any> {
    const body = { IdCiudad: IdCiudad };
    return this.http.get<any>(URL_ENDPOINT + 'sede/obtener/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  getSedes(IdCiudad: number): Observable<any> {
    const body = { IdCiudad: IdCiudad };
    return this.http.get<any>(URL_ENDPOINT + 'campus/listado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  cambiarSedeEncargado(IdUsuario: number,IdSede: number): Observable<any> {
    const body = {
      IdUsuario:IdUsuario,
      IdSede:IdSede
    };
    return this.http.put(URL_ENDPOINT + 'cambiarde/sede/?token='+this.loginService.datoLocalStorage.token, body);
  }

  campusActivar(IdCampus: number): Observable<any> {
    const body = {
      id:IdCampus
    };
    return this.http.put(URL_ENDPOINT + 'campus/activar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  campusDesactivar(IdCampus: number): Observable<any> {
    const body = {
      id:IdCampus,
    };
    return this.http.put(URL_ENDPOINT + 'campus/desactivar/?token='+this.loginService.datoLocalStorage.token, body);
  }

  getEstado(IdCampus: number): Observable<any> {
    const body = { IdCampus:IdCampus };
    return this.http.get<any>(URL_ENDPOINT + 'campus/estado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }
}