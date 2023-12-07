import { Component } from '@angular/core';
import { CampusService } from 'src/Service/campus/campus.service';
import { HomeService } from 'src/Service/home/home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent {
 
  constructor(public campusService: CampusService, private homeService: HomeService){}

  ngOnInit(): void {
    this.getCiudad(this.homeService.datoLocalStorage.IdCiudad);
  }


  getCiudad(IdCiudad: number) {
    this.campusService.getCiudad(IdCiudad).subscribe((response) => {
      this.campusService.NomCiudad = response.data[0].NomCiudad;
      this.getSedes(this.homeService.datoLocalStorage.IdCiudad);
    });
  }

  getSedes(IdCiudad: number) {
    this.campusService.getSedes(IdCiudad).subscribe( (response) => {
      this.campusService.sedes =  response.data;
      this.campusService.NomSedeActual = response.data[0].NomSede;
      this.campusService.IdSede  = response.data[0].IdSede;
      this.campusService.AcroSedeActual=  response.data[0].Acronimo;
      this.campusService.triggerMethod();
      this.campusService.cambiarSedeEncargado(this.homeService.datoLocalStorage.IdUsuario,response.data[0].IdSede).subscribe();
    });
  }

  CambiarSede(NomSede: string, IdSede: number, AcronimoSede:string) {
    this.campusService.booleanhome=false
    if(this.homeService.datoLocalStorage.IdRol!=1){
      Swal.fire({
        title: '¿Estas seguro de cambiarte de campus?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.AcroSedeActual= AcronimoSede;
          this.campusService.NomSedeActual = NomSede;
          this.campusService.IdSede = IdSede;
          this.homeService.datoLocalStorage.IdSede=IdSede;
          this.campusService.triggerMethod();
          this.campusService.cambiarSedeEncargado(this.homeService.datoLocalStorage.IdUsuario,this.campusService.IdSede).subscribe();
        }
      });
    }else{
      this.campusService.AcroSedeActual= AcronimoSede;
      this.campusService.NomSedeActual = NomSede;
      this.campusService.IdSede = IdSede;
      this.campusService.triggerMethod();
    }
  }
}