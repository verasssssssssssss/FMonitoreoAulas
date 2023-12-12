import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { AulasH } from 'src/Clases/Aulas';
import { CarrerasSede } from 'src/Clases/CarrerasSede';
import { Cursos } from 'src/Clases/Cursos';
import { DatosReserva, Datosbloque } from 'src/Clases/Horario';
import { Sedes } from 'src/Clases/Sedes';
import { NotificacionService } from 'src/Service/Notificacion/notificacion.service';
import { CampusService } from 'src/Service/campus/campus.service';
import { HomeService } from 'src/Service/home/home.service';
import { HorarioService } from 'src/Service/horario.service';
import { LoginService } from 'src/Service/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {
  @ViewChild('tabla') tabla!: ElementRef;

  Aulas!: AulasH[];
  sedes!: Sedes[];

  reserva: DatosReserva[] = [];
  bloque!: Datosbloque[];

  CarrerasSede!: CarrerasSede[];
  cursosSede!: Cursos[];
  cursosSelect!: Cursos[];

  Nomaula: string = "...";
  Idaula: number = -1;
  prueba: string = "...";
  color!: string;
  rango: number = 0;

  contador: number = 0;
  booleanhorario: number = 0;

  formularioReserva: FormGroup;

  bloquesAcademicos = [
    { indice: 1, tiempo: '08:10 a 08:50' },
    { indice: 2, tiempo: '08:50 a 09:30' },
    { indice: 3, tiempo: '09:40 a 10:20' },
    { indice: 4, tiempo: '10:20 a 11:00' },
    { indice: 5, tiempo: '11:10 a 11:50' },
    { indice: 6, tiempo: '11:50 a 12:30' },
    { indice: 7, tiempo: '12:40 a 13:20' },
    { indice: 8, tiempo: '13:20 a 14:00' },
    { indice: 9, tiempo: '14:10 a 14:50' },
    { indice: 10, tiempo: '14:50 a 15:30' },
    { indice: 11, tiempo: '15:40 a 16:20' },
    { indice: 12, tiempo: '16:20 a 17:00' },
    { indice: 13, tiempo: '17:10 a 17:50' },
    { indice: 14, tiempo: '17:50 a 18:30' },
    { indice: 15, tiempo: '18:40 a 19:20' },
    { indice: 16, tiempo: '19:20 a 20:00' },
  ];

  constructor(private loginService: LoginService,private fb: FormBuilder, private notificacionService: NotificacionService, public campusService: CampusService, private horarioService: HorarioService, private homeService: HomeService) {
    this.formularioReserva = this.fb.group({
      Curso: ['', [Validators.required]],
      carrera: ['', [Validators.required]],
      FechaLimite: ['', [Validators.required]],
      DiaClases: ['', [Validators.required]],
      IdAula: ['', [Validators.required]],
      IdSede: ['', [Validators.required]],
      IdBloque: ['', [Validators.required]],
      rango: ['', [Validators.required]],
    });
    this.formularioReserva.get('carrera')?.valueChanges.subscribe(carreraId => {
      this.cursosSelect = this.getCursosPorCarrera(carreraId);
    });
  }

  getCursosPorCarrera(carreraId: number): any[] {
    return this.cursosSede.filter(curso => curso.IdCarrera == carreraId);
  }

  ngOnInit(): void {
    this.loginService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getAulas(this.loginService.datoLocalStorage.IdSede);
    this.campusService.triggerMethod$.subscribe(() => {
      this.getAulas(this.loginService.datoLocalStorage.IdSede);
    });
  }

  getAulas(IdSede: number) {
    this.horarioService.getAulas(IdSede).subscribe((response) => {
      this.Aulas = response.data;
    });
  }

  ngAfterViewInit() {
    this.agregarEventoClickACeldas();
  }

  agregarEventoClickACeldas() {
    const tablaElement = this.tabla.nativeElement;
    if (tablaElement) {
      tablaElement.addEventListener('click', (event: Event) => {
        const clickedElement = event.target as HTMLElement;
        if (clickedElement.tagName === 'TD') {
          const tdId = clickedElement.id;
          if (tdId != '') {
            this.notificacionService.getCarrerasSede(this.campusService.IdSede).subscribe((responsee) => {
              this.CarrerasSede = responsee.data;
              this.horarioService.getCursos(this.campusService.IdSede).subscribe((response) => {
                this.cursosSede = response.data;
                const firstPart = tdId.substring(0, tdId.length - 1);
                const secondPart = tdId.charAt(tdId.length - 1);
                if (clickedElement.textContent == 'Agendar') {
                  this.formularioReserva.patchValue({
                    DiaClases: secondPart,
                    IdAula: this.Idaula,
                    IdSede: this.campusService.IdSede,
                    IdBloque: parseInt(firstPart, 10)
                  });
                  let i: number = parseInt(firstPart, 10);
                  for (i; i <= 16; i++) {
                    let g = document.getElementById(i + "" + secondPart)?.textContent;
                    if (g == null || g != 'Agendar') {
                      if (i == parseInt(firstPart, 10)) {
                        this.rango = 0;
                        this.formularioReserva.patchValue({
                          rango: 0,
                        });
                      } else {
                        this.rango = (i - parseInt(firstPart, 10));
                      }
                      i = 20;
                    }
                  }
                  if (i == 17) {
                    this.rango = (i - (parseInt(firstPart, 10)));
                  }
                  this.abrirModalHorario();
                } else {
                  if (clickedElement.textContent != '') {
                    this.eliminarRreserva(parseInt(firstPart, 10), parseInt(secondPart, 10));
                  }
                }
              });
            });
          }
        }
      });
    }
  }

  eliminarRreserva(Idbloques: number, Dia: number) {
    this.reserva.forEach((item) => {
      if (item.DiaClases == Dia) {
        for (let i = 0; i < item.bloque.length; i++) {
          if (item.bloque[i].IdBloque == Idbloques) {
            this.confirmarEliminarRreserva(item.IdReserva, item.bloque[i].IdBloque, item.NomCurso, i, item.bloque.length);
          }
        }
      }
    });
  }

  confirmarEliminarRreserva(IdReserva: number, Idbloque: number, Clase: string, I: number, tamanio: number,) {
    Swal.fire({
      title: '¿Quieres eliminar la reserva del bloque de ' + this.bloquesAcademicos[Idbloque - 1].tiempo + ' de la clase ' + Clase + '?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.horarioService.eliminarReservaBloque(IdReserva, Idbloque).subscribe((response) => {
          if (tamanio == 1) {
            this.horarioService.eliminarReserva(IdReserva).subscribe((response) => { });
          }
          this.successSwal("Reserva eliminada correctamente");
          this.getReservas();
          this.crearTabla();
        }, (error) => {
          this.errorSwal("Ocurrio un error al eliminar reserva");
        });
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selecionarAula(nom: string, id: number) {
    this.contador = 0;
    this.booleanhorario = 1;
    this.Nomaula = nom;
    this.Idaula = id;
    this.getReservas();
    this.crearTabla();
  }

  crearTabla() {
    timer(1000).subscribe(() => {
      this.limpiarContenidosTabla();
      this.reserva.forEach((item) => {
        this.contador = this.contador + 1;
        this.color = this.obtenerColorFondoClaro();
        item.bloque.forEach((item1) => {
          this.modificarContenido(item1.IdBloque + '' + item.DiaClases, item.NomCurso, item.Codigo);
        });
      });
      if (this.contador === this.reserva.length) {
        this.booleanhorario = 2;
      }
    });
  }

  agregarReserva() {
    Swal.fire({
      title: '¿Estas seguro de Agregar esta reserva?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.horarioService.crearReserva(parseInt(this.formularioReserva.get('DiaClases')?.value, 10), this.formularioReserva.get('FechaLimite')?.value,
          parseInt(this.formularioReserva.get('Curso')?.value, 10), this.formularioReserva.get('IdAula')?.value, this.campusService.IdSede,
          this.formularioReserva.get('IdBloque')?.value, this.formularioReserva.get('rango')?.value
        ).subscribe((response) => {
          this.successSwal("Reserva agregada Correctamente");
          this.cerrarrModalHorario();
          this.getReservas();
          this.crearTabla();
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar al encargado");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.cerrarrModalHorario();
      }
    });
  }

  getReservas() {
    this.horarioService.getReservas(this.Idaula).subscribe((response) => {
      this.reserva = response.data;
      this.reserva.forEach((item) => {
        this.horarioService.getBloques(item.IdReserva).subscribe((responsee) => {
          item.bloque = responsee.data
        });
      });
    });
  }

  modificarContenido(id: string, nuevoContenido: string, codigo: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      if (codigo == '000000') {
        elemento.textContent = nuevoContenido;
      } else {
        elemento.textContent = nuevoContenido + " (" + codigo + ")";
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
          celdas[j].textContent = 'Agendar';
          celdas[j].style.backgroundColor = '#FFFFFF';
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
    return color;
  }


  abrirModalHorario() {
    const modal = document.getElementById('ModalHorario');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarrModalHorario() {
    const modal = document.getElementById('ModalHorario');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
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
}