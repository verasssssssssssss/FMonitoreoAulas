import { Component } from '@angular/core';
import { AreasDeTrabajo } from 'src/Clases/AreasDeTrabajo';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { HomeService } from 'src/Service/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  datoLocalStorage!: Usuarios;
  sedes!: Sedes[];
  NomCiudad!: string;
  NomSedeActual!: string;
  AreasDeTrabajo!: AreasDeTrabajo[];

  constructor(private homeService:HomeService) { }

  ngOnInit(): void {
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
      this.getAreasDeTrabajo(this.sedes[0].IdSede);
    });
  }

  getAreasDeTrabajo(IdSede:number){
    this.homeService.getAreasDeTrabajo(IdSede).subscribe(  (response) => {
      this.AreasDeTrabajo=response.data;
      this.getAulas();
    });
  }

  getAulas(){
    this.AreasDeTrabajo.forEach(AreaT => {
      this.homeService.getAulas(AreaT.IdArea).subscribe(  (response) => {
        AreaT.Aulas=response.data;
      });
    });
  }

  CambiarSede(NomSede:string,IdSede:number){
    this.NomSedeActual = NomSede;
    this.getAreasDeTrabajo(IdSede);
  }
}
