import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { URL_ENDPOINT} from '../../Config/config';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http : HttpClient) { }

  getReportes(IdSede:number):Observable<any>{
    return this.http.get<any>(URL_ENDPOINT+'reporte/listado/'+IdSede);
  }

  eliminarReporte(Idreporte: number): Observable<any> {
    const body = {};
    return this.http.delete(URL_ENDPOINT + 'reporte/eliminar/' + Idreporte, body);
  }
}
