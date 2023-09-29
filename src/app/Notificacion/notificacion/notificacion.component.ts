import { Component } from '@angular/core';
import { notificacion } from 'src/Clases/Notificacion';
import { Usuarios } from 'src/Clases/Usuarios';
import { NotificacionService } from 'src/Service/Notificacion/notificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent {

  notificacion!:notificacion;
  datoLocalStorage!: Usuarios;

  constructor(private notificacionService:NotificacionService) { }

  ngOnInit(): void {
    this.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
    setInterval(() => {
      this.miFuncion();
    }, 50000); // 10000 milisegundos = 50 segundos
  }

  miFuncion() {
    this.notificacionService.agregarNotifiacion(this.datoLocalStorage.IdUsuario).subscribe((response) => {
      if(response.dataLenghy!=0){
        this.notificacion = response.data[0];
        this.alertaDesusoDeAula(this.notificacion.NomArea,this.notificacion.NomAula,this.notificacion.CapturaFotografica);
      }
    });
  }

  alertaDesusoDeAula(NomArea:string,NomAula:string,fotografia:string){
    Swal.fire({
      title: 'Posible desuso de aula',
      text: 'En el aula '+NomAula+' del área '+NomArea,
      imageUrl: fotografia,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
      showCancelButton: true, 
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Descartar' 
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Confirmado', 'Has confirmado la acción', 'success');
      } else if (result.isDismissed) {
        Swal.fire('Descartado', 'Has descartado la acción', 'error');
      }
    });
  }
}