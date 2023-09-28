import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasDeTrabajo } from 'src/Clases/AreasDeTrabajo';
import { Aulas } from 'src/Clases/Aulas';
import { Encargado, EncargadoE } from 'src/Clases/Encargado';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { HomeService } from 'src/Service/home/home.service';
import Swal from 'sweetalert2';

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
  IdSedeActual!: number;
  AreasDeTrabajo!: AreasDeTrabajo[];
  Encargados!: Encargado[];
  EncargadosSelecionado: EncargadoE = { IdUsuario: -1, NomUsuario: "", ApeUsuario: "", Mail: "", Contrasenia: "" };
  AreasDeTrabajoSeleccionado!: number;
  AulaSeleccionada: Aulas[] = [];
  nombre: string = '';
  nombreAreaT: string = '';
  cantidad: number = 0;
  tipoModalAula!: boolean;
  tipoModalAreaDeTrabajo!: boolean;
  tipoModalEncargadoAE!: boolean;
  nomAreaDeTrabajoSeleccionada: string = '';

  formularioEncargado: FormGroup;

  constructor(private fb: FormBuilder, private homeService: HomeService) {
    this.formularioEncargado = this.fb.group({
      Nombre: ['', [Validators.required]],
      Apellido: ['', [Validators.required]],
      Mail: ['', [Validators.required, Validators.email]],
      Contrasenia: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.getCiudad(this.datoLocalStorage.IdCiudad);
    this.getSedes(this.datoLocalStorage.IdCiudad);
  }

  getCiudad(IdCiudad: number) {
    this.homeService.getCiudad(IdCiudad).subscribe((response) => {
      this.NomCiudad = response.data[0].NomCiudad;
    });
  }

  getSedes(IdCiudad: number) {
    this.homeService.getSedes(IdCiudad).subscribe((response) => {
      console.log(response)
      this.sedes = response.data;
      this.NomSedeActual = this.sedes[0].NomSede;
      this.IdSedeActual = this.sedes[0].IdSede;
      this.getAreasDeTrabajo(this.IdSedeActual);
      this.getEncargadosSede(this.IdSedeActual);
    });
  }

  getAreasDeTrabajo(IdSede: number) {
    this.homeService.getAreasDeTrabajo(IdSede).subscribe((response) => {
      this.AreasDeTrabajo = response.data;
      this.getAulas();
    });
  }

  getAulas() {
    this.AreasDeTrabajo.forEach(AreaT => {
      this.homeService.getAulas(AreaT.IdArea).subscribe((response) => {
        AreaT.Aulas = response.data;
      });
    });
  }

  CambiarSede(NomSede: string, IdSede: number) {
    this.NomSedeActual = NomSede;
    this.IdSedeActual = IdSede;
    this.getAreasDeTrabajo(IdSede);
    this.getEncargadosSede(IdSede);
  }


  asignarAreasDeTrabajo(IdAreasDeTrabajo: number, IdUsuario: number) {
    if (IdUsuario != -1) {
      this.homeService.asignarAreasDeTrabajo(IdAreasDeTrabajo, IdUsuario).subscribe((response) => {
        this.successSwal("Encargado asignado Correctamente");
        this.getAreasDeTrabajo(this.IdSedeActual);
      }, (error) => {
        this.errorSwal("Ocurrio un error al asignar un encargado");
      });
    } else {
      this.infoSwal("Debe selecionar un encargado");
    }
  }

  delegarAreasDeTrabajo(IdAreasDeTrabajo: number) {
    Swal.fire({
      title: '¿Estas Seguro de quitar al encargado?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.delegarAreasDeTrabajo(IdAreasDeTrabajo).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
          this.successSwal("Área de trabajo liberada");
        });
      }
    });
  }

  eliminarAula(IdAula: number, NomAula: string) {
    Swal.fire({
      title: '¿Estas seguro de eliminar el aula ' + NomAula + '?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.eliminarAula(IdAula).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
          this.successSwal("El aula se elimino correctamente");
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar el aula " + this.AulaSeleccionada[0].NomAula);
        });
      }
    });
  }

  eliminarAreasDeTrabajo(IdArea: number, NomArea: string) {
    Swal.fire({
      title: '¿Estas seguro de eliminar el área de trabajo ' + NomArea + '?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.eliminarAreasDeTrabajo(IdArea).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
          this.successSwal("El Área se elimino correctamente");
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar el Área " + NomArea);
        });
      }
    });
  }

  Asignar(IdUsuario: any) {
    this.asignarAreasDeTrabajo(this.AreasDeTrabajoSeleccionado, Number(IdUsuario));
    this.cerrarModalAsignar();
  }

  getEncargadosSede(IdSede: number) {
    this.homeService.getEncargadosSede(IdSede).subscribe((response) => {
      this.Encargados = response.data;
    });
  }

  abrirModalAsignar(IdAreasDeTrabajo: number) {
    this.AreasDeTrabajoSeleccionado = IdAreasDeTrabajo;
    const modal = document.getElementById('ModalAsignar');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarModalAsignar() {
    const modal = document.getElementById('ModalAsignar');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  abrirModalAula(Aula: any, tipoModal: boolean, IdArea: number) {
    if (tipoModal) {
      this.AulaSeleccionada.push(Aula);
    } else {
      this.AreasDeTrabajoSeleccionado = IdArea;
      let Aaula: Aulas = { IdAula: 0, NomAula: "", CantidadAlumnos: 0, Visible: 1, IdArea: 0 };
      this.AulaSeleccionada.push(Aaula);
    }
    this.tipoModalAula = tipoModal;
    const modal = document.getElementById('ModalAula');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarModalAula() {
    console.log('cerrar modal');
    const modal = document.getElementById('ModalAula');
    if (modal != null) {
      modal.style.display = 'none';
    }
    this.AulaSeleccionada = [];
    this.nombre = '';
    this.cantidad = 0;
  }

  EditarOAgregarAula() {
    if (this.nombre != '' || this.cantidad != 0) {
      let nnombre = this.AulaSeleccionada[0].NomAula;
      let ccantidad = this.AulaSeleccionada[0].CantidadAlumnos;
      if (this.nombre != '') {
        nnombre = this.nombre;
      }
      if (this.cantidad != 0) {
        ccantidad = this.cantidad;
      }
      if (this.tipoModalAula) {
        Swal.fire({
          title: '¿Estas seguro de editar el aula ' + this.AulaSeleccionada[0].NomAula + '?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.homeService.editarAula(this.AulaSeleccionada[0].IdAula, nnombre, ccantidad).subscribe((response) => {
              this.getAreasDeTrabajo(this.IdSedeActual);
              this.successSwal("El aula se edito correctamente");
              this.cerrarModalAula();
            }, (error) => {
              this.errorSwal("Ocurrio un error al intentar editar el aula " + this.AulaSeleccionada[0].NomAula);
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.cerrarModalAula();
          }
        });
      } else {
        this.homeService.agregarAula(this.AreasDeTrabajoSeleccionado, nnombre, ccantidad).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
          this.successSwal("El aula se creo correctamente");
          this.cerrarModalAula();
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar agregar la nueva aula");
        });
      }
    }
  }

  abrirModalEncargado() {
    const modal = document.getElementById('ModalEncargado');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }
  cerrarModalEncargado() {
    const modal = document.getElementById('ModalEncargado');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  abrirModalAreaDeTrabajo(AreaDeTrabajo: boolean, nomAreaDeTrabajo: string, idAreaDeTrabajo: number) {
    this.tipoModalAreaDeTrabajo = AreaDeTrabajo;
    this.nomAreaDeTrabajoSeleccionada = nomAreaDeTrabajo;
    this.AreasDeTrabajoSeleccionado = idAreaDeTrabajo;
    console.log("el id es -Z " + this.AreasDeTrabajoSeleccionado);
    const modal = document.getElementById('ModalAreaDeTrabajo');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  EditarOAgregarAreaDeTrabajo() {
    if (this.nombreAreaT != '') {
      console.log(this.nombreAreaT);
      if (this.tipoModalAreaDeTrabajo) {
        this.homeService.agregarAreaDeTrabajo(this.IdSedeActual, this.nombreAreaT).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
          this.successSwal("El área de trabajo se creo correctamente");
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar agregar la nueva área de trabajo");
        });
      } else {
        Swal.fire({
          title: '¿Estas seguro de editar el área de trabajo ' + this.nombreAreaT + '?',
          showDenyButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.homeService.editarAreaDeTrabajo(this.nombreAreaT, this.AreasDeTrabajoSeleccionado).subscribe((response) => {
              this.getAreasDeTrabajo(this.IdSedeActual);
              this.successSwal("El área de trabajo se edito correctamente");
              this.cerrarModalAreaDeTrabajo();
            }, (error) => {
              this.errorSwal("Ocurrio un error al intentar editar el el área de trabajo " + this.nombreAreaT);
              this.cerrarModalAreaDeTrabajo();
            });
          }
        });
      }
    }
  }

  cerrarModalAreaDeTrabajo() {
    const modal = document.getElementById('ModalAreaDeTrabajo');
    if (modal != null) {
      modal.style.display = 'none';
    }
    this.nomAreaDeTrabajoSeleccionada = '';
    this.AreasDeTrabajoSeleccionado = 0;
  }

  abrirModalEncargadoAE(AreaDeTrabajo: boolean, idEncargado: number) {
    this.tipoModalEncargadoAE = AreaDeTrabajo;
    this.homeService.getEncargadoObtener(idEncargado).subscribe((response) => {
      this.EncargadosSelecionado = response.data[0];
      console.log(this.EncargadosSelecionado);
      if (this.EncargadosSelecionado != undefined) {
        this.formularioEncargado.patchValue({
          Nombre: this.EncargadosSelecionado.NomUsuario,
          Apellido: this.EncargadosSelecionado.ApeUsuario,
          Mail: this.EncargadosSelecionado.Mail,
          Contrasenia: this.EncargadosSelecionado.Contrasenia,
        });
      } else {
        this.formularioEncargado.patchValue({
          Nombre: '',
          Apellido: '',
          Mail: '',
          Contrasenia: '',
        });
      }
      const modal = document.getElementById('ModalEncargadoAE');
      if (modal != null) {
        modal.style.display = 'block';
      }
    });
  }

  cerrarModalEncargadoAE(accion: boolean) {
    if (accion) {
      if (this.tipoModalEncargadoAE) {
        this.homeService.agregarEncargado(this.formularioEncargado.get('Nombre')?.value, this.formularioEncargado.get('Apellido')?.value, this.formularioEncargado.get('Mail')?.value, this.formularioEncargado.get('Contrasenia')?.value, this.IdSedeActual).subscribe((response) => {
          this.successSwal("El encargado se creo correctamente");
          this.getEncargadosSede(this.IdSedeActual);
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar agregar a un nueva encargado para la sede " + this.NomSedeActual);
        });
        this.cerrarrModalEncargado();
      } else {
        Swal.fire({
          title: '¿Estas seguro de editar al encargado ' + this.EncargadosSelecionado.NomUsuario + " " + this.EncargadosSelecionado.ApeUsuario + '?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.homeService.editarEncargado(this.EncargadosSelecionado.IdUsuario, this.formularioEncargado.get('Nombre')?.value, this.formularioEncargado.get('Apellido')?.value, this.formularioEncargado.get('Mail')?.value, this.formularioEncargado.get('Contrasenia')?.value, this.IdSedeActual).subscribe((response) => {
              this.successSwal("El encargado de aula se edito correctamente");
              this.getEncargadosSede(this.IdSedeActual);
              this.getAreasDeTrabajo(this.IdSedeActual);
              this.cerrarrModalEncargado();
            }, (error) => {
              this.errorSwal("Ocurrio un error al intentar editar el encargado de aula " + this.EncargadosSelecionado.NomUsuario + " " + this.EncargadosSelecionado.ApeUsuario);
              this.cerrarrModalEncargado();
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.cerrarrModalEncargado();
          }
        });
      }
    }
  }

  cerrarrModalEncargado() {
    const modal = document.getElementById('ModalEncargadoAE');
    if (modal != null) {
      modal.style.display = 'none';
    }
    this.EncargadosSelecionado = { IdUsuario: 0, NomUsuario: "", ApeUsuario: "", Mail: "", Contrasenia: "" };
  }

  eliminarEncargado(IdUsuario: number, NomUsuario: string, Apellido: string) {
    Swal.fire({
      title: '¿Estas seguro de eliminar al encargado ' + NomUsuario + " " + Apellido + '?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.eliminarEncargado(IdUsuario).subscribe((response) => {
          this.homeService.quitarEncargado(IdUsuario).subscribe((response) => {
            this.getAreasDeTrabajo(this.IdSedeActual);
            this.getEncargadosSede(this.IdSedeActual);
          });
          this.successSwal("El encargado " + NomUsuario + " " + Apellido + " se elimino correctamente");
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar al encargado");
        });
      }
    });
  }

  nomAreaDeTrabajoInputChange(event: any) {
    this.nombreAreaT = event.target.value;
  }

  nombreInputChange(event: any) {
    this.nombre = event.target.value;
  }

  edadInputChange(event: any) {
    this.cantidad = parseInt(event.target.value, 10);
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

  infoSwal(title: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }
}