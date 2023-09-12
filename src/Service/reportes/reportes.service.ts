import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { reporte } from 'src/Clases/reportes';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http : HttpClient) { }

  getReportes():Observable<any>{
    return this.http.get<any>('http://localhost:3000/reporte/listado/1');
  }
}


