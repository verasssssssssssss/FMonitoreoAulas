import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { URL_ENDPOINT} from '../../Config/config';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http : HttpClient, private loginService:LoginService) { }

  getReportes(IdSede:number):Observable<any>{
    const body = { IdSede:IdSede };
    return this.http.get<any>(URL_ENDPOINT+'reporte/listado/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }

  eliminarReporte(Idreporte: number): Observable<any> {
    const body = {Idreporte:Idreporte};
    return this.http.delete(URL_ENDPOINT + 'reporte/eliminar/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }
}
