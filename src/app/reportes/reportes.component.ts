import { Component, OnInit } from '@angular/core';
import { reporte } from 'src/Clases/reportes';
import { ReportesService } from 'src/Service/reportes/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reportes!:reporte[];
  CapturaFotografica!:string;
  NombreAula!:string;
  CodigoCorreo!:number;
  modal = true;

  constructor(private sreportes: ReportesService){}
  ngOnInit() {
    this.getRepoertes();
  }

  getRepoertes(){
    this.sreportes.getReportes().subscribe(  (response) => {
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

}
