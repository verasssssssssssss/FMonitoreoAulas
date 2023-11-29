import { Component, OnInit } from '@angular/core';
import { Sedes } from 'src/Clases/Sedes';
import { reporte } from 'src/Clases/reportes';
import { CampusService } from 'src/Service/campus/campus.service';
import { HomeService } from 'src/Service/home/home.service';
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

  reportes!:reporte[];
  sedes!: Sedes[];
  CapturaFotografica!:string;
  NombreAula!:string;
  CodigoCorreo!:number;
  modal = true;



  constructor(public campusService: CampusService,private sreportes: ReportesService,public homeService:HomeService){}
  ngOnInit() {
    this.homeService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getRepoertes(this.homeService.datoLocalStorage.IdSede);
    this.campusService.triggerMethod$.subscribe(() => {
      this.getRepoertes(this.campusService.IdSede);
    });
  }

  onBuscarCurso() {
    this.getRepoertes(this.campusService.IdSede);
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


  eliminarReporte(Idreporte:number){
    Swal.fire({
      title: '¿Estas seguro de eliminar el reporte?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.sreportes.eliminarReporte(Idreporte).subscribe(  (response) => {
          this.getRepoertes(this.homeService.datoLocalStorage.IdSede);
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
