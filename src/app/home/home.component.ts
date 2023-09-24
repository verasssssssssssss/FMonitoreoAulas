import { Component } from '@angular/core';
import { AreasDeTrabajo } from 'src/Clases/AreasDeTrabajo';
import { Aulas } from 'src/Clases/Aulas';
import { Encargado, EncargadoE } from 'src/Clases/Encargado';
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
  IdSedeActual!: number;
  AreasDeTrabajo!: AreasDeTrabajo[];
  Encargados!: Encargado[];
  EncargadosSelecionado: EncargadoE = { IdUsuario: 0, NomUsuario: "", ApeUsuario: "", Mail: "", Contrasenia: "" };
  AreasDeTrabajoSeleccionado!: number;
  AulaSeleccionada: Aulas[] = [];
  nombre: string = '';
  nombreAreaT: string = '';
  cantidad: number = 0;
  tipoModalAula!: boolean;
  tipoModalAreaDeTrabajo!: boolean;
  tipoModalEncargadoAE!: boolean;
  nomAreaDeTrabajoSeleccionada: string = '';

  constructor(private homeService: HomeService) { }

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
    this.homeService.asignarAreasDeTrabajo(IdAreasDeTrabajo, IdUsuario).subscribe((response) => {
      this.getAreasDeTrabajo(this.IdSedeActual);
    });
  }

  delegarAreasDeTrabajo(IdAreasDeTrabajo: number) {
    this.homeService.delegarAreasDeTrabajo(IdAreasDeTrabajo).subscribe((response) => {
      this.getAreasDeTrabajo(this.IdSedeActual);
    });
  }

  eliminarAula(IdAula: number) {
    this.homeService.eliminarAula(IdAula).subscribe((response) => {
      this.getAreasDeTrabajo(this.IdSedeActual);
    });
  }

  eliminarAreasDeTrabajo(IdArea: number) {
    this.homeService.eliminarAreasDeTrabajo(IdArea).subscribe((response) => {
      this.getAreasDeTrabajo(this.IdSedeActual);
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
        this.homeService.editarAula(this.AulaSeleccionada[0].IdAula, nnombre, ccantidad).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
        });
      } else {
        this.homeService.agregarAula(this.AreasDeTrabajoSeleccionado, nnombre, ccantidad).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
        });
      }
    }
    this.cerrarModalAula();
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
    const modal = document.getElementById('ModalAreaDeTrabajo');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  EditarOAgregarAreaDeTrabajo() {
    if (this.nombreAreaT != '') {
      if (this.tipoModalAreaDeTrabajo) {
        this.homeService.agregarAreaDeTrabajo(this.IdSedeActual, this.nombreAreaT).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
        });
      } else {
        this.homeService.editarAreaDeTrabajo(this.nombreAreaT, this.AreasDeTrabajoSeleccionado).subscribe((response) => {
          this.getAreasDeTrabajo(this.IdSedeActual);
        });
      }
      this.cerrarModalAreaDeTrabajo();
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
      console.log(response.data);
      const modal = document.getElementById('ModalEncargadoAE');
      if (modal != null) {
        modal.style.display = 'block';
      }
    });
  }
  cerrarModalEncargadoAE(accion:boolean) {
    if(accion){
      let  Encargado = this.EncargadosSelecionado;
      if(this.tipoModalEncargadoAE){
        if( this.EncargadosSelecionado.NomUsuario!= "" && this.EncargadosSelecionado.ApeUsuario!= "" && this.EncargadosSelecionado.Mail!= "" && this.EncargadosSelecionado.Contrasenia!="" ){
          this.homeService.agregarEncargado(this.IdSedeActual,Encargado).subscribe((response) => {
            console.log(response);
            this.getEncargadosSede(this.IdSedeActual);
          });
        }
      }else{
        this.homeService.editarEncargado(this.IdSedeActual,Encargado).subscribe((response) => {
          console.log(response);
          this.getEncargadosSede(this.IdSedeActual);
        });
      }
    }
    const modal = document.getElementById('ModalEncargadoAE');
    if (modal != null) {
      modal.style.display = 'none';
    }
    this.EncargadosSelecionado = { IdUsuario: 0, NomUsuario: "", ApeUsuario: "", Mail: "", Contrasenia: "" };
  }

  eliminarEncargado(IdUsuario: number) {
    this.homeService.eliminarEncargado(IdUsuario).subscribe();
    this.homeService.quitarEncargado(IdUsuario).subscribe((response) => { 
      this.getAreasDeTrabajo(this.IdSedeActual);
      this.getEncargadosSede(this.IdSedeActual);
    });
  }

  EncargadoInputChange(tipo: number, event: any) {
    switch (tipo) {
      case 1:
        this.EncargadosSelecionado.NomUsuario = event.target.value;
        break;
      case 2:
        this.EncargadosSelecionado.ApeUsuario = event.target.value;
        break;
      case 3:
        this.EncargadosSelecionado.Mail = event.target.value;
        break;
      case 4:
        this.EncargadosSelecionado.Contrasenia = event.target.value;
        break;
    }
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
}