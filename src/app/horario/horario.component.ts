import { Component } from '@angular/core';
import { AulasH } from 'src/Clases/Aulas';
import { DatosReserva } from 'src/Clases/Horario';
import { Sedes } from 'src/Clases/Sedes';
import { CampusService } from 'src/Service/campus/campus.service';
import { HomeService } from 'src/Service/home/home.service';
import { HorarioService } from 'src/Service/horario.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {

  Aulas!: AulasH[];
  sedes!: Sedes[];

  reserva:DatosReserva[] =[];

  Nomaula: string = "...";
  Idaula: number = 2;
  prueba: string = "...";

  constructor(public campusService: CampusService,private horarioService:HorarioService,private homeService:HomeService) {}

  ngOnInit(): void {
    this.homeService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getAulas(this.homeService.datoLocalStorage.IdSede);
    this.campusService.triggerMethod$.subscribe(() => {
      this.getAulas(this.homeService.datoLocalStorage.IdSede);
    });

  }

  getAulas(IdSede: number) {
    this.horarioService.getAulas(IdSede).subscribe(async (response) => {
      this.Aulas = response.data;
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
