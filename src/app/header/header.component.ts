import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuarios } from 'src/Clases/Usuarios';
import { HomeService } from 'src/Service/home/home.service';
import {AngularFireStorage} from '@angular/fire/compat/storage'
import Swal from 'sweetalert2';
import { __await } from 'tslib';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  datoLocalStorage!: Usuarios;

  formularioUsuario: FormGroup;

  cargandoFotografia:boolean=false;

  imageUrl!: string; 

  constructor(private fb: FormBuilder, private router: Router, private homeService: HomeService,private fireStorage:AngularFireStorage) {
    this.formularioUsuario = this.fb.group({
      Nombre: ['', [Validators.required]],
      Apellido: ['', [Validators.required]],
      Mail: ['', [Validators.required, Validators.email]],
      Fotografia: ['../../assets/Imagenes/perfil.png', [Validators.required]],
      Contrasenia: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    this.imageUrl = this.formularioUsuario.get('Fotografia')?.value;
    this.obtenerDatos();
  }

  eliminarDatoDelLocalStorage() {
    localStorage.removeItem('UsuarioLogueado');
    this.router.navigate(['/login']);
  }

  obtenerDatos(){
    this.homeService.getusuario(this.datoLocalStorage.IdUsuario).subscribe((response) => {
      if (response.data[0] != undefined) {
        if(response.data[0].Fotografia!=undefined && response.data[0].Fotografia!=null) {
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
        this.imageUrl =  this.formularioUsuario.get('Fotografia')?.value;
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
          this.homeService.editarUsuario(this.datoLocalStorage.IdUsuario, this.formularioUsuario.get('Nombre')?.value, this.formularioUsuario.get('Apellido')?.value,this.formularioUsuario.get('Fotografia')?.value, this.formularioUsuario.get('Mail')?.value, this.formularioUsuario.get('Contrasenia')?.value).subscribe((response) => {
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

  abrirModalAdministrarCuenta() {
    const modal = document.getElementById('ModalAdministrarCuenta');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }


  async onfileChange(event:any){
    this.cargandoFotografia=true;
    const file = event.target.files[0];
    if(file){
      const path = `Referencias/${file.name}`
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL()
      await this.formularioUsuario.patchValue({
        Fotografia: url,
      });
      this.imageUrl = url;
      this.cargandoFotografia=false;
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





