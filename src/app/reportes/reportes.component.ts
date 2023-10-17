import { Component, OnInit } from '@angular/core';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { reporte } from 'src/Clases/reportes';
import { HomeService } from 'src/Service/home/home.service';
import { LoginService } from 'src/Service/login/login.service';
import { ReportesService } from 'src/Service/reportes/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  filtroCurso: string='';

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

  constructor(private loginService: LoginService,private sreportes: ReportesService,private homeService:HomeService){}
  ngOnInit() {
    this.datoLocalStorage = this.loginService.datoLocalStorage;
    this.getCiudad(this.datoLocalStorage.IdCiudad);
    this.getSedes(this.datoLocalStorage.IdCiudad);
  }

  onBuscarCurso() {
    // Llama a la función que obtiene los reportes con el nuevo filtro
    this.getRepoertes(this.IdSedeActual);
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
      this.IdSedeActual = this.sedes[0].IdSede;
      this.getRepoertes(this.IdSedeActual);
    });
  }

  getRepoertes(IdSede: number) {
    this.sreportes.getReportes(IdSede).subscribe((response) => {
      this.reportes = response.data;
      this.reportes.forEach(element => {
        this.transform(element);
      });

      // Aplicar el filtro por curso
      if (this.filtroCurso) {
        this.reportes = this.reportes.filter(reporte =>
          reporte.NomCurso.toLowerCase().includes(this.filtroCurso.toLowerCase())
        );
      }
    });
  }


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
    Swal.fire({
      title: '¿Estas seguro de eliminar el reporte?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.sreportes.eliminarReporte(Idreporte).subscribe(  (response) => {
          this.getRepoertes(this.IdSedeActual);
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar el reporte");
        });
      }
    });
  }

  successSwal(title: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1300
    });
  }

  errorSwal(title: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: 'Intenta en más tarde',
      showConfirmButton: false,
      timer: 1500
    });
  }

  transform(report:  reporte) {
    const parts = report.FechaReporte.split('T');
    const parts1 = parts[1].split('Z');
    report.FechaReporte = parts[0];
    report.HoraReporte = parts1[0].substring(0, parts1[0].length - 4);
  }
}
