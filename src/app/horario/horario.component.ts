import { Component } from '@angular/core';
import { AulasH } from 'src/Clases/Aulas';
import { DatosReserva } from 'src/Clases/Horario';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { HomeService } from 'src/Service/home/home.service';
import { HorarioService } from 'src/Service/horario.service';
import { LoginService } from 'src/Service/login/login.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {

  Aulas!: AulasH[];
  sedes!: Sedes[];
  datoLocalStorage!: Usuarios;
  NomSedeActual!: string;
  IdSedeActual!: number;
  NomCiudad!: string;

  reserva:DatosReserva[] =[];

  Nomaula: string = "...";
  Idaula: number = 2;
  prueba: string = "...";

  constructor(private loginService: LoginService,private horarioService:HorarioService,private homeService:HomeService) {}

  ngOnInit(): void {
    this.datoLocalStorage = this.loginService.datoLocalStorage;
    this.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.loginService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getCiudad(this.datoLocalStorage.IdCiudad);
    this.getSedes(this.datoLocalStorage.IdCiudad);

  }

  getAulas(IdSede: number) {
    this.horarioService.getAulas(IdSede).subscribe(async (response) => {
      this.Aulas = response.data;
    });
  }

  getSedes(IdCiudad: number) {
    this.homeService.getSedes(IdCiudad).subscribe(async (response) => {
      this.sedes = response.data;
      this.NomSedeActual = this.sedes[0].NomSede;
      this.IdSedeActual = this.sedes[0].IdSede;
      this. getAulas(this.IdSedeActual);
    });
  }

  CambiarSede(NomSede: string, IdSede: number) {
    this.NomSedeActual = NomSede;
    this.IdSedeActual = IdSede;
    this. getAulas(this.IdSedeActual);
  }

  getCiudad(IdCiudad: number) {
    this.getReservas();
    this.homeService.getCiudad(IdCiudad).subscribe(async (response) => {
      this.NomCiudad = await response.data[0].NomCiudad;
    });
  }

  selecionarAula(nom:string,id:number){
    this.Nomaula=nom;
    this.Idaula=id;
    this.getReservas();
  }


  getReservas() {
    this.horarioService.getReservas(this.Idaula).subscribe(async (response) => {
      this.reserva= await response.data;
      this.reserva.forEach((item) => {
        this.horarioService.getBloques(item.IdReserva).subscribe(async (response) => {
          item.nBloques = await response.data;
        });
      });
    });
  }
}
