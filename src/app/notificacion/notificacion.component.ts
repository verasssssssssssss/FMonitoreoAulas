import { DatePipe } from '@angular/common';
import { ReturnStatement } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrerasSede } from 'src/Clases/CarrerasSede';
import { DatosCorreo } from 'src/Clases/DatosCorreo';
import { notificacion, reserva } from 'src/Clases/Notificacion';
import { Usuarios } from 'src/Clases/Usuarios';
import { NotificacionService } from 'src/Service/Notificacion/notificacion.service';
import { CampusService } from 'src/Service/campus/campus.service';
import { HomeService } from 'src/Service/home/home.service';
import { LoginService } from 'src/Service/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent {

  notificacion!: notificacion;
  datosCorreo!: DatosCorreo;
  fechaActual!: Date;
  fechaFormateada!: string;
  carrerasSede!: CarrerasSede[];
  reserva!: reserva;
  idCarreraSelecionada!: number;
  bloque!: number;
  fecha!: number;
  img!: string;
  formularioCorreo: FormGroup;
  timerInterval: any;
  option: string = "";
  recibitNotificacion: boolean = true;
  rangosDeTiempo = [
    { inicio: 8.10, fin: 8.50 },
    { inicio: 8.50, fin: 9.30 },

    { inicio: 9.40, fin: 10.20 },
    { inicio: 10.20, fin: 11.00 },

    { inicio: 11.10, fin: 11.50 },
    { inicio: 11.50, fin: 12.30 },

    { inicio: 12.40, fin: 13.20 },
    { inicio: 13.20, fin: 14.00 },

    { inicio: 14.10, fin: 14.50 },
    { inicio: 14.50, fin: 15.30 },

    { inicio: 15.40, fin: 16.20 },
    { inicio: 16.20, fin: 15.30 },

    { inicio: 15.40, fin: 16.20 },
    { inicio: 16.20, fin: 17.00 },

    { inicio: 17.10, fin: 17.50 },
    { inicio: 17.50, fin: 18.30 },

    { inicio: 18.40, fin: 19.20 },
    { inicio: 19.20, fin: 20.00 },
  ];

  constructor(private loginService: LoginService, public campusService: CampusService, public homeService: HomeService, private fb: FormBuilder, private notificacionService: NotificacionService, private datePipe: DatePipe) {
    this.fechaActual = new Date();
    this.fechaFormateada = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy HH:mm:ss') || 'Fecha inválida';

    this.formularioCorreo = this.fb.group({
      NomCoordinador: [{ value: '', disabled: true }, [Validators.required]],
      NomSede: [{ value: '', disabled: true }, [Validators.required]],
      NomAula: [{ value: '', disabled: true }, [Validators.required]],
      Fecha: [{ value: '', disabled: true }, [Validators.required]],
      Codigo: ['', [Validators.required]],
      NomCurso: ['', [Validators.required]],
      NomCarrera: ['', [Validators.required]],
      CapturaFotografica: ['', [Validators.required]],
      IdUsuario: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.recibitNotificacion && this.homeService.datoLocalStorage.IdRol == 2) {
        this.campusService.getEstado(this.homeService.datoLocalStorage.IdSede).subscribe((response) => {
          if (response.data[0].Activa == 1 && this.recibitNotificacion) {
            this.recibitNotificacion = !this.recibitNotificacion;
            this.getNotifiacionDesuso();
          }
        });
      }
    }, 6000); // 10000 milisegundos = 10 segundos
  }

  getNotifiacionDesuso() {
    this.notificacionService.getDatosCorreo(this.loginService.datoLocalStorage.IdSede).subscribe((response) => {
      this.datosCorreo = response.data[0];
    });
    this.notificacionService.getCarrerasSede(this.loginService.datoLocalStorage.IdSede).subscribe((response) => {
      this.carrerasSede = response.data;
    });
    this.notificacionService.getNotifiacionDesuso(this.homeService.datoLocalStorage.IdSede).subscribe((response) => {
      if (response.dataLenghy != 0) {
        this.notificacion = response.data[0];
        this.obtenerBloque(this.notificacion.Fecha);
      } else {
        this.recibitNotificacion = !this.recibitNotificacion;
      }
    });
  }

  obtenerBloque(fecha: string) {
    const fechaHora = new Date(fecha);
    const horas = fechaHora.getUTCHours();
    const minutos = fechaHora.getUTCMinutes();
    this.obtenerRangoTiempo(horas, minutos);
  }

  obtenerRangoTiempo(hora: number, minuto: number) {
    let i;
    this.fecha = (hora - 3) + (minuto / 100);
    for (i = 0; i < this.rangosDeTiempo.length; i++) {
      if (this.rangosDeTiempo[i].inicio <= this.fecha && this.fecha < this.rangosDeTiempo[i].fin) {
        this.notificacionService.getDatosAulaDesuso(1, this.notificacion.IdAula, (i + 1)).subscribe((response) => {
          if(response.dataLenghy>=1){
            this.reserva = response.data[0];
            this.formularioCorreo.patchValue({
              NomCoordinador: this.datosCorreo.NomUsuario + " " + this.datosCorreo.ApeUsuario,
              NomSede: this.datosCorreo.NomSede,
              NomAula: this.notificacion.NomAula,
              Fecha: this.fechaFormateada,
              Codigo: this.reserva.Codigo,
              NomCurso: this.reserva.NomCurso,
              NomCarrera: this.reserva.NomCarrera,
              CapturaFotografica: this.notificacion.CapturaFotografica,
              IdUsuario: this.homeService.datoLocalStorage.IdUsuario,
            });
            this.alertaDesusoDeAula(this.notificacion.NomAula, this.notificacion.CapturaFotografica);
          }else{
            this.notificacionService.validarAlerta(this.notificacion.IdDatos, 0).subscribe();
            this.recibitNotificacion = !this.recibitNotificacion;
          }
        });
        i = 500;
      }
    }
    if(i == this.rangosDeTiempo.length){
      this.notificacionService.validarAlerta(this.notificacion.IdDatos, 0).subscribe();
      this.recibitNotificacion = !this.recibitNotificacion;
    }
  }

  alertaDesusoDeAula(NomAula: string, fotografia: string) {
    Swal.fire({
      title: 'Posible desuso de aula',
      text: 'En el aula ' + NomAula,
      imageUrl: fotografia,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Descartar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.abrirModalAreaDeTrabajo();
      } else if (result.isDismissed) {
        Swal.fire({
          title: '¿Estas seguro que la alerta no es correcta?',
          showDenyButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.successSwal('Has descartado el posible desuso de aula');
            this.recibitNotificacion = !this.recibitNotificacion;
            this.notificacionService.validarAlerta(this.notificacion.IdDatos, 0).subscribe();
          } else {
            this.alertaDesusoDeAula(NomAula, fotografia);
          }
        });
      }
    });
  }

  EnviarCorreo() {
    this.enviandoCorreo();
    this.notificacionService.enviarCorreo(this.datosCorreo.Mail, this.datosCorreo.NomUsuario, this.datosCorreo.ApeUsuario, this.datosCorreo.NomSede,
      this.formularioCorreo.get('NomCurso')?.value, this.formularioCorreo.get('Codigo')?.value, this.fechaFormateada, this.formularioCorreo.get('NomCarrera')?.value,
      this.homeService.datoLocalStorage.NomUsuario + "" + this.homeService.datoLocalStorage.ApeUsuario, this.notificacion.NomAula, this.notificacion.CapturaFotografica).subscribe((response) => {
      });
    this.notificacionService.agregarReporte(this.reserva.IdCurso, this.reserva.IdCarrera, this.homeService.datoLocalStorage.IdUsuario, this.notificacion.IdAula, this.notificacion.IdDatos).subscribe((response) => {
      this.cerrarrModalCorreoPre();
      this.cerrarrModalCorreo(false, true);
    }, (error) => {
      console.log("error al generar reporte");
    });
  }

  enviandoCorreo() {
    Swal.fire({
      html: 'Enviando correo generado <b></b> milisegundos.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        if (b) {
          this.timerInterval = setInterval(() => {
            const timerLeft = Swal.getTimerLeft();
            if (timerLeft !== undefined) {
              b.textContent = timerLeft.toString();
            }
          }, 100);
        }
      },
      willClose: () => {
        clearInterval(this.timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        this.successSwal("Correo Enivado correctamente");
      }
    });

  }

  cerrarrModalCorreo(PrevCorreo: boolean, enviado: boolean) {

    if (PrevCorreo) {
      this.abrirModalCorreoPre();
    } else {
      if (!enviado) {
        this.alertaDesusoDeAula(this.notificacion.NomAula, this.notificacion.CapturaFotografica);
      } else {
        this.recibitNotificacion = !this.recibitNotificacion;
        this.notificacionService.validarAlerta(this.notificacion.IdDatos, 1).subscribe();
      }
      const modal = document.getElementById('ModalCorreo');
      if (modal != null) {
        modal.style.display = 'none';
      }
    }

  }

  abrirModalAreaDeTrabajo() {
    const modal = document.getElementById('ModalCorreo');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarrModalCorreoPre() {
    const modal = document.getElementById('ModalCorreoPrev');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  abrirModalCorreoPre() {
    const modal = document.getElementById('ModalCorreoPrev');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  carreraSInputChange(Carrera: any) {
    this.carrerasSede.forEach(elemento => {
      if (elemento.IdCarrera == Carrera.target.value) {
        this.formularioCorreo.patchValue({
          NomCarrera: elemento.NomCarrera,
        });
        this.idCarreraSelecionada = elemento.IdCarrera;
      }
    });
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

  infoSwal(title: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }
}
