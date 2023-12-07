import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasDeTrabajo } from 'src/Clases/AreasDeTrabajo';
import { Aulas } from 'src/Clases/Aulas';
import { Usuario, UsuarioE } from 'src/Clases/Encargado';
import { Sedes } from 'src/Clases/Sedes';
import { Usuarios } from 'src/Clases/Usuarios';
import { CampusService } from 'src/Service/campus/campus.service';
import { HomeService } from 'src/Service/home/home.service';
import { LoginService } from 'src/Service/login/login.service';

import {dashboardService} from 'src/Service/dashboard/dashboard.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  sedes!: Sedes[];

  AreasDeTrabajo!: AreasDeTrabajo[];
  Encargados!:  Usuario[];
  EncargadosSelecionado:  UsuarioE = { IdUsuario: -1, NomUsuario: "", ApeUsuario: "", Mail: "", Contrasenia: "", 	Fotografia: ""};
  AreasDeTrabajoSeleccionado!: number;
  AulaSeleccionada: Aulas[] = [];
  nombre: string = '';
  nombreAreaT: string = '';
  cantidad: number = 0;
  tipoModalAula!: boolean;
  tipoModalAreaDeTrabajo!: boolean;
  tipoModalEncargadoAE!: boolean;
  nomAreaDeTrabajoSeleccionada: string = '';
  imageUrl: string ='../../assets/Imagenes/perfil.png';
  cargandoFotografia:boolean=false;

  formularioEncargado: FormGroup;

  constructor(private router: Router,private dashboardService: dashboardService,public campusService: CampusService,private fb: FormBuilder, public homeService: HomeService,private fireStorage:AngularFireStorage) {
    this.formularioEncargado = this.fb.group({
      Fotografia: ['',],
      Nombre: ['', [Validators.required]],
      Apellido: ['', [Validators.required]],
      Mail: ['', [Validators.required, Validators.email]],
      Contrasenia: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.campusService.triggerMethod$.subscribe(() => {
      this.getAreasDeTrabajo(this.campusService.IdSede);
    });
  }
  
  cambiarSedeEncargado(IdUsuario: number,IdSede: number){
    this.homeService.cambiarSedeEncargado(IdUsuario,IdSede).subscribe((response) => {});
  }

  getAreasDeTrabajo(IdSede: number) {
    this.homeService.getAreasDeTrabajo(IdSede).subscribe(async (response) => {
      this.AreasDeTrabajo = await response.data;
      this.getAulas();
      this.getEncargados(this.homeService.datoLocalStorage.IdCiudad);
    });
  }

  getEncargados(IdCiudad: number) {
    this.homeService.getEncargado(IdCiudad).subscribe(async (response) => {
      this.Encargados=  await response.data;
    });
  }

  getAulas() {
    this.AreasDeTrabajo.forEach(AreaT => {
      this.homeService.getAulas(AreaT.IdArea).subscribe((response) => {
        AreaT.Aulas = response.data;
        this.campusService.booleanhome=true;
      });
    });
  }

  CambiarSede(NomSede: string, IdSede: number, AcronimoSede:string) {
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
        this.getAreasDeTrabajo(IdSede);
        this.homeService.cambiarSedeEncargado(this.homeService.datoLocalStorage.IdUsuario,this.campusService.IdSede).subscribe();
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
          this.getAreasDeTrabajo(this.campusService.IdSede );
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
          this.getAreasDeTrabajo(this.campusService.IdSede);
          this.successSwal("El Área se elimino correctamente");
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar el Área " + NomArea);
        });
      }
    });
  }


  abrirModalAula(Aula: any, tipoModal: boolean, Area: any) {
    if (tipoModal) {
      this.AulaSeleccionada.push(Aula);
    } else {
      this.AreasDeTrabajoSeleccionado = Area.IdArea;
      let Aaula: Aulas = { IdAula: 0, NomAula: Area.NomArea, CantidadAlumnos: 0, Visible: 1, IdArea: 0 };
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
        Swal.fire({
          title: '¿Estas seguro de editar el aula ' + this.AulaSeleccionada[0].NomAula + '?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.homeService.editarAula(this.AulaSeleccionada[0].IdAula, nnombre, ccantidad).subscribe((response) => {
              this.getAreasDeTrabajo(this.campusService.IdSede);
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
          this.getAreasDeTrabajo(this.campusService.IdSede);
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
    if(nomAreaDeTrabajo==''){
      if(this.campusService.AcroSedeActual=='FM MC'){
        this.nomAreaDeTrabajoSeleccionada = 'FM';
      }else{
        this.nomAreaDeTrabajoSeleccionada = this.campusService.AcroSedeActual;
      }
    }else{
      this.nomAreaDeTrabajoSeleccionada = nomAreaDeTrabajo;
    }
    this.AreasDeTrabajoSeleccionado = idAreaDeTrabajo;
    const modal = document.getElementById('ModalAreaDeTrabajo');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  EditarOAgregarAreaDeTrabajo() {
    if (this.nombreAreaT != '') {
      if (this.tipoModalAreaDeTrabajo) {
        this.homeService.agregarAreaDeTrabajo(this.campusService.IdSede, this.nombreAreaT).subscribe((response) => {
          this.getAreasDeTrabajo(this.campusService.IdSede);
          this.successSwal("El área de trabajo se creo correctamente");
          this.cerrarModalAreaDeTrabajo();
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
              this.getAreasDeTrabajo(this.campusService.IdSede);
              this.successSwal("El área de trabajo se edito correctamente");
            }, (error) => {
              this.errorSwal("Ocurrio un error al intentar editar el el área de trabajo " + this.nombreAreaT);
            });
          }
          this.cerrarModalAreaDeTrabajo();
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
    this.homeService.getusuario(idEncargado).subscribe(async (response) => {
      this.EncargadosSelecionado =  await response.data[0];
      if (this.EncargadosSelecionado != undefined) {
        this.formularioEncargado.patchValue({
          Nombre: this.EncargadosSelecionado.NomUsuario,
          Apellido: this.EncargadosSelecionado.ApeUsuario,
          Mail: this.EncargadosSelecionado.Mail,
          Contrasenia: this.EncargadosSelecionado.Contrasenia,
          Fotografia: this.EncargadosSelecionado.Fotografia,
        });
        if(this.EncargadosSelecionado.Fotografia!=null){
          this.imageUrl=this.EncargadosSelecionado.Fotografia;
        }else{
          this.imageUrl='../../assets/Imagenes/perfil.png';
        }
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
        this.homeService.agregarEncargado(this.formularioEncargado.get('Nombre')?.value, this.formularioEncargado.get('Apellido')?.value, this.formularioEncargado.get('Mail')?.value, this.formularioEncargado.get('Contrasenia')?.value, this.formularioEncargado.get('Fotografia')?.value,this.homeService.datoLocalStorage.IdCiudad).subscribe((response) => {
          this.successSwal("El encargado se creo correctamente");
          this.getEncargados(this.homeService.datoLocalStorage.IdCiudad);
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar agregar a un nueva encargado para la sede " + this.campusService.NomSedeActual);
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
            this.homeService.editarEncargado(this.EncargadosSelecionado.IdUsuario, this.formularioEncargado.get('Nombre')?.value, this.formularioEncargado.get('Apellido')?.value, this.formularioEncargado.get('Mail')?.value, this.formularioEncargado.get('Contrasenia')?.value,this.formularioEncargado.get('Fotografia')?.value, this.campusService.IdSede).subscribe((response) => {
              this.successSwal("El encargado de aula se edito correctamente");
              this.cerrarrModalEncargado();
              this.getEncargados(this.homeService.datoLocalStorage.IdCiudad);
            }, (error) => {
              this.errorSwal("Ocurrio un error al intentar editar el encargado de aula " + this.EncargadosSelecionado.NomUsuario + " " + this.EncargadosSelecionado.ApeUsuario);
              this.cerrarrModalEncargado();
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.cerrarrModalEncargado();
          }
        });
      }
    }else{
      this.cerrarrModalEncargado();
    }
  }

  cerrarrModalEncargado() {
    const modal = document.getElementById('ModalEncargadoAE');
    if (modal != null) {
      modal.style.display = 'none';
    }
    this.EncargadosSelecionado = { IdUsuario: 0, NomUsuario: "", ApeUsuario: "", Mail: "", Contrasenia: "", 	Fotografia: ""};
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
          this.getEncargados(this.homeService.datoLocalStorage.IdCiudad);
          this.successSwal("El encargado " + NomUsuario + " " + Apellido + " se elimino correctamente");
        }, (error) => {
          this.errorSwal("Ocurrio un error al intentar eliminar al encargado");
        });
      }
    });
  }

  nomAreaDeTrabajoInputChange(event: any) {
    this.nombreAreaT = event.target.value + this.campusService.AcroSedeActual;
  }

  nombreInputChange1(event: any) {
      this.nombre = event.target.value + this.campusService.AcroSedeActual;
  }

  nombreInputChange2(event: any) {
      this.nombre = event.target.value;
  }

  edadInputChange(event: any) {
    this.cantidad = parseInt(event.target.value, 10);
  }

  async onfileChange(event:any){
    this.cargandoFotografia=true;
    const file = event.target.files[0];
    if(file){
      const path = `Referencias/${file.name}`
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL()
      await this.formularioEncargado.patchValue({
        Fotografia: url,
      });
      this.imageUrl = await url;
      this.cargandoFotografia=false;
    }
  }

  Visualizar(  idAula:number, NomAula:string){
    this.dashboardService.idAula=idAula;
    this.dashboardService.NomAula=NomAula;
    this.router.navigate(['/dashboard']);
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