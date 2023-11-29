import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { timer } from 'rxjs';
import { AulasH } from 'src/Clases/Aulas';
import { DatosReserva, Datosbloque } from 'src/Clases/Horario';
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
  @ViewChild('tabla') tabla!: ElementRef;

  Aulas!: AulasH[];
  sedes!: Sedes[];

  reserva:DatosReserva[] =[];
  bloque!:Datosbloque[];

  Nomaula: string = "...";
  Idaula: number = -1;
  prueba: string = "...";
  color!: string;

  constructor(private renderer: Renderer2,public campusService: CampusService,private horarioService:HorarioService,private homeService:HomeService) {}
  ngOnInit(): void {
    this.homeService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getAulas(this.homeService.datoLocalStorage.IdSede);
    this.campusService.triggerMethod$.subscribe(() => {
      this.getAulas(this.homeService.datoLocalStorage.IdSede);
    });
    this.agregarEventosClicATD();
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
    timer(1000).subscribe(() => {
      this.limpiarContenidosTabla();
      this.reserva.forEach((item) => {
        this.color = this.obtenerColorFondoClaro();
        item.bloque.forEach((item1) => {
          this.modificarContenido(item1.IdBloque+''+item.DiaClases,item.NomCurso,item.Codigo);
        });
      });
    });
  }

  getReservas() {
    this.horarioService.getReservas(this.Idaula).subscribe( (response) => {
      this.reserva= response.data;
      this.reserva.forEach((item) => {
        this.horarioService.getBloques(item.IdReserva).subscribe( (responsee) => {
          item.bloque = responsee.data
        });
      });
    });
  }

  modificarContenido(id: string, nuevoContenido: string, codigo: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      if(codigo=='000000'){
        elemento.textContent = nuevoContenido;
      }else{
        elemento.textContent = nuevoContenido +" ("+codigo+")"; 
      }
      elemento.style.backgroundColor = this.color;
    }
  }

  limpiarContenidosTabla() {
    const tabla = document.getElementById("tabla");
    if (tabla) {
      const filas = tabla.getElementsByTagName('tr');
      for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        for (let j = 1; j < celdas.length; j++) {
          celdas[j].textContent = '';
          celdas[j].style.backgroundColor='#FFFFFF';
        }
      }
    }
  }

  obtenerColorFondoClaro(): string {
    const letras = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 3; i++) {
      color += letras[Math.floor(Math.random() * letras.length)];
    }
    return color; // Repetir el color tres veces para obtener un tono más claro
  }

  agregarEventosClicATD() {
    const tablaElement = this.tabla.nativeElement;
    if (tablaElement) {
      tablaElement.querySelectorAll('.dato').forEach((td: Element) => {
        td.addEventListener('click', () => {
          console.log('Contenido del TD:', td.textContent);
        });
    });
  }
}
}
