import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { URL_ENDPOINT } from 'src/Config/config';

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  
  sedes!: Sedes[];
  NomSedeActual!: string;
  AcroSedeActual!: string;
  NomCiudad!: string;
  IdSede!: number;
  
  constructor(private http: HttpClient) { }


  private triggerMethodSubject = new Subject<void>();

  triggerMethod$ = this.triggerMethodSubject.asObservable();

  triggerMethod() {   
    this.triggerMethodSubject.next();
  }



  getCiudad(IdCiudad: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'sede/obtener/' + IdCiudad);
  }

  getSedes(IdCiudad: number): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'sede/listado/' + IdCiudad);
  }

  cambiarSedeEncargado(IdUsuario: number,IdSede: number): Observable<any> {
    const body = {
      IdUsuario:IdUsuario,
      IdSede:IdSede
    };
    return this.http.put(URL_ENDPOINT + 'usuario/cambiar/sede', body);
  }
}