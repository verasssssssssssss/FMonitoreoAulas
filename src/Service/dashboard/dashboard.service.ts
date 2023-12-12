import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_ENDPOINT } from 'src/Config/config';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class dashboardService {
  
  idAula!:number;
  NomAula!:string;

  Temperatura:number=0
  Humedad:number=0;
  co2:number=0;

  constructor(private http: HttpClient,private loginService:LoginService) {}

  getTempHumedad(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/tempHum/'+this.idAula);
  }

  getco2tvoc(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/co2tvoc/'+this.idAula);
  }

  getIntensidadLuminica(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'datos/Iluminica/'+this.idAula);
  }

  getAulasConSensores(): Observable<any> {
    return this.http.get<any>(URL_ENDPOINT + 'aula/listado/todos/');
  }

  getMonitoreoSensor(IdSede:number): Observable<any> {
    const body = { IdSede:IdSede};
    return this.http.get<any>(URL_ENDPOINT + 'sensores/monitorear/?token='+this.loginService.datoLocalStorage.token,{params:body});
  }
}