import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuarios } from 'src/Clases/Usuarios';
import { HomeService } from 'src/Service/home/home.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import Swal from 'sweetalert2';
import { __await } from 'tslib';
import { LoginService } from 'src/Service/login/login.service';
import { CampusService } from 'src/Service/campus/campus.service';
import { Sedes } from 'src/Clases/Sedes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  formularioUsuario: FormGroup;

  cargandoFotografia: boolean = false;

  imageUrl!: string;

  rutaActiva: string = '';


  setRutaActiva(ruta: string) {
    this.rutaActiva = ruta;
  }

  constructor(private loginService: LoginService, private fb: FormBuilder, public campusService: CampusService, private router: Router, public homeService: HomeService, private fireStorage: AngularFireStorage) {
    
    this.formularioUsuario = this.fb.group({
      Nombre: ['', [Validators.required]],
      Apellido: ['', [Validators.required]],
      Mail: ['', [Validators.required, Validators.email]],
      Fotografia: ['../../assets/Imagenes/perfil.png', [Validators.required]],
      Contrasenia: ['', [Validators.required, Validators.minLength(8)]],
    });
    const objetoAlmacenado = localStorage.getItem('UsuarioLogueado');

    if (objetoAlmacenado) {
      this.loginService.datoLocalStorage = JSON.parse(objetoAlmacenado);
    }
  }

  async ngOnInit(): Promise<void> {
    this.homeService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.imageUrl = this.formularioUsuario.get('Fotografia')?.value;
    this.obtenerDatos();
  }

  eliminarDatoDelLocalStorage(cerrar: boolean) {
    if (cerrar) {
      localStorage.removeItem('UsuarioLogueado');
      this.homeService.datoLocalStorage = { IdUsuario: 0, NomUsuario: "0", ApeUsuario: "0", Mail: "0", IdRol: 0, IdSede: 0, IdCarrera: 0, IdCiudad: 0, token: "0" };
    }
    this.router.navigate(['/login']);
  }

  obtenerDatos() {
    this.homeService.getusuario(this.homeService.datoLocalStorage.IdUsuario).subscribe((response) => {
      if (response.data[0] != undefined) {
        if (response.data[0].Fotografia != undefined && response.data[0].Fotografia != null) {
          this.formularioUsuario.patchValue({
            Fotografia: response.data[0].Fotografia,
          });
        }
        this.formularioUsuario.patchValue({
          Nombre: response.data[0].NomUsuario,
          Apellido: response.data[0].ApeUsuario,
          Mail: response.data[0].Mail,
          Contrasenia: response.data[0].Contrasenia,
        });
        this.imageUrl = this.formularioUsuario.get('Fotografia')?.value;
      }
    });
  }

  cerrarModalAdministrarCuenta(accion: boolean) {
    if (accion) {
      Swal.fire({
        title: '¿Estas seguro de editar los datos de tu cuenta?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.homeService.editarUsuario(this.homeService.datoLocalStorage.IdUsuario, this.formularioUsuario.get('Nombre')?.value, this.formularioUsuario.get('Apellido')?.value, this.formularioUsuario.get('Fotografia')?.value, this.formularioUsuario.get('Mail')?.value, this.formularioUsuario.get('Contrasenia')?.value).subscribe((response) => {
            this.successSwal("Los datos de tu cuenta fueron actualizados correctamente");
            const modal = document.getElementById('ModalAdministrarCuenta');
            if (modal != null) {
              modal.style.display = 'none';
            }
          }, (error) => {
            this.errorSwal("Ocurrio un error al intentar editar los datos de tu cuenta fueron actualizado");
          });
        }
      });
    } else {
      const modal = document.getElementById('ModalAdministrarCuenta');
      if (modal != null) {
        modal.style.display = 'none';
      }
    }
  }

  abrirModalAdministrarCampus() {
    this.campusService.getSedes(this.homeService.datoLocalStorage.IdCiudad).subscribe((response) => {
      console.log(response.data);
      this.campusService.sedes = response.data;
      this.transformm(this.campusService.sedes);
    });
    const modal = document.getElementById('ModalAdministrarCampus');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarModalAdministrarCampus(accion: boolean) {
    if (accion) {
      Swal.fire({
        title: '¿Estas seguro de editar los datos de tu cuenta?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.homeService.editarUsuario(this.homeService.datoLocalStorage.IdUsuario, this.formularioUsuario.get('Nombre')?.value, this.formularioUsuario.get('Apellido')?.value, this.formularioUsuario.get('Fotografia')?.value, this.formularioUsuario.get('Mail')?.value, this.formularioUsuario.get('Contrasenia')?.value).subscribe((response) => {
            this.successSwal("Los datos de tu cuenta fueron actualizados correctamente");
            const modal = document.getElementById('ModalAdministrarCuenta');
            if (modal != null) {
              modal.style.display = 'none';
            }
          }, (error) => {
            this.errorSwal("Ocurrio un error al intentar editar los datos de tu cuenta fueron actualizado");
          });
        }
      });
    } else {
      const modal = document.getElementById('ModalAdministrarCampus');
      if (modal != null) {
        modal.style.display = 'none';
      }
    }
  }

  abrirModalAdministrarCuenta() {
    const modal = document.getElementById('ModalAdministrarCuenta');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  editarCampus(tipo: boolean, idCampus: number, nomCampus: string) {
    if (tipo) {
      this.campusService.campusActivar(idCampus).subscribe(() => {
        this.campusService.getSedes(this.homeService.datoLocalStorage.IdCiudad).subscribe((response) => {
          this.campusService.sedes = response.data;
          this.transformm(this.campusService.sedes);
        });
      });
    } else {
      Swal.fire({
        title: '¿Estas seguro de desactivar las notificaciones del campus ' + nomCampus + ' ?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.campusDesactivar(idCampus).subscribe(() => {
            this.campusService.getSedes(this.homeService.datoLocalStorage.IdCiudad).subscribe((response) => {
              this.successSwal('las notificaciones del campus ' + nomCampus + ' fue desactivada correctamente');
              this.campusService.sedes = response.data;
              this.transformm(this.campusService.sedes);
            });
          });
        }
      });
    }
  }

  transformm(sede: Sedes[]) {
    sede.forEach(element => {
      this.transform(element);
    });
  }

  transform(sede: Sedes) {
    if (sede.FechaActivacion != null) {
      const parts = sede.FechaActivacion.split('T');
      const parts1 = parts[1].split('Z');
      sede.FechaActivacion = parts[0] + " " + parts1[0].substring(0, parts1[0].length - 4);
    }
  }

  async onfileChange(event: any) {
    this.cargandoFotografia = true;
    const file = event.target.files[0];
    if (file) {
      const path = `Referencias/${file.name}`
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL()
      await this.formularioUsuario.patchValue({
        Fotografia: url,
      });
      this.imageUrl = url;
      this.cargandoFotografia = false;
    }
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
}





