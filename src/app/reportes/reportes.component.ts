import { Component, OnInit } from '@angular/core';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { reporte } from 'src/Clases/reportes';
import { HomeService } from 'src/Service/home/home.service';
import { ReportesService } from 'src/Service/reportes/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  p:number = 1;

  datoLocalStorage!: Usuarios;
  reportes!:reporte[];
  sedes!: Sedes[];
  CapturaFotografica!:string;
  NombreAula!:string;
  CodigoCorreo!:number;
  modal = true;
  NomCiudad!: string;
  NomSedeActual!: string;
  IdSedeActual!: number;

  constructor(private sreportes: ReportesService,private homeService:HomeService){}
  ngOnInit() {
    this.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getCiudad(this.datoLocalStorage.IdCiudad);
    this.getSedes(this.datoLocalStorage.IdCiudad);
  }

  getCiudad(IdCiudad:number){
    this.homeService.getCiudad(IdCiudad).subscribe(  (response) => {
      this.NomCiudad=response.data[0].NomCiudad;
    });
  }

  getSedes(IdCiudad:number){
    this.homeService.getSedes(IdCiudad).subscribe(  (response) => {
      this.sedes=response.data;
      this.NomSedeActual = this.sedes[0].NomSede;
      this.getRepoertes(this.sedes[0].IdSede);
    });
  }

  getRepoertes(IdSede:number){
    this.sreportes.getReportes(IdSede).subscribe(  (response) => {
      this.reportes=response.data;
      console.log(this.reportes);
    }
  )}

  abrirModal(iddatos: number,nomaula: string,url: string){
    this.CapturaFotografica=url;
    this.NombreAula=nomaula;
    this.CodigoCorreo=iddatos;
    const modal = document.getElementById('miModal');
    if(modal != null){
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    const modal = document.getElementById('miModal');
    if(modal != null){
      modal.style.display = 'none';
    }
  }

  okClicked() {
    this.cerrarModal();
  }

  CambiarSede(NomSede:string,IdSede:number){
    this.NomSedeActual = NomSede;
    this.IdSedeActual = IdSede;
    this.getRepoertes(IdSede);
  }

  eliminarReporte(Idreporte:number){
    this.sreportes.eliminarReporte(Idreporte).subscribe(  (response) => {
      this.getRepoertes(this.IdSedeActual);
    }
  )}
}
