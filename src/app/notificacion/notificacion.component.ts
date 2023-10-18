import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrerasSede } from 'src/Clases/CarrerasSede';
import { DatosCorreo } from 'src/Clases/DatosCorreo';
import { notificacion } from 'src/Clases/Notificacion';
import { Usuarios } from 'src/Clases/Usuarios';
import { NotificacionService } from 'src/Service/Notificacion/notificacion.service';
import { LoginService } from 'src/Service/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent {

  notificacion!:notificacion;
  datoLocalStorage!: Usuarios;
  datosCorreo!: DatosCorreo;
  fechaActual!: Date;
  fechaFormateada!: string;
  carrerasSede!:CarrerasSede[];
  idCarreraSelecionada!:number;
  img!: string;
  formularioCorreo: FormGroup;
  timerInterval: any;
  option:string ="";
  recibitNotificacion: boolean = true;

  constructor(private loginService: LoginService,private fb: FormBuilder,private notificacionService:NotificacionService,private datePipe: DatePipe) {
    this.fechaActual = new Date();
    this.fechaFormateada = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy HH:mm:ss') || 'Fecha inválida';

    this.formularioCorreo = this.fb.group({
      NomCoordinador: [{ value: '', disabled: true }, [Validators.required]],
      NomSede:  [{ value: '', disabled: true }, [Validators.required]],
      NomArea:  [{ value: '', disabled: true }, [Validators.required]],
      NomAula:  [{ value: '', disabled: true }, [Validators.required]],
      Fecha:  [{ value: '', disabled: true }, [Validators.required]],
      NomCurso:  ['', [Validators.required]],
      NomProfesor:  ['', [Validators.required]],
      NomCarrera:  ['', [Validators.required]],
      CapturaFotografica:  ['', [Validators.required]],
      IdUsuario:  ['', [Validators.required]],
    });
   }

   ngOnInit(): void {
    this.datoLocalStorage = this.loginService.datoLocalStorage;
    setInterval(() => {
      if(this.recibitNotificacion){
          this.recibitNotificacion = !this.recibitNotificacion;
          this.getNotifiacionDesuso();
      }
    }, 10000); // 10000 milisegundos = 10 segundos
  }

  getNotifiacionDesuso() {
    this.notificacionService.getDatosCorreo(1).subscribe((response) => {
      this.datosCorreo = response.data[0];
    });
    this.notificacionService.getCarrerasSede(1).subscribe((response) => {
      this.carrerasSede = response.data;
    });
    this.notificacionService.getNotifiacionDesuso(this.datoLocalStorage.IdUsuario).subscribe((response) => {
      if(response.dataLenghy!=0){
        this.notificacion = response.data[0];
        console.log(response.data[0]);
        this.option = this.notificacion.NomCarrera;

        this.alertaDesusoDeAula(this.notificacion.NomArea,this.notificacion.NomAula,this.notificacion.CapturaFotografica);

        this.formularioCorreo.patchValue({
          NomCoordinador:  this.datosCorreo.NomUsuario+" "+this.datosCorreo.ApeUsuario,
          NomSede: this.datosCorreo.NomSede,
          NomArea:  this.notificacion.NomArea,
          NomAula:  this.notificacion.NomAula,
          Fecha:  this.fechaFormateada,

          NomCurso:  this.notificacion.NomCurso,
          NomProfesor:   this.notificacion.NomProfesor,
          CapturaFotografica:  this.notificacion.CapturaFotografica,
          IdUsuario:  this.datoLocalStorage.IdUsuario,
        });
      }else{
        this.recibitNotificacion = !this.recibitNotificacion;
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
            this.notificacionService.validarAlerta(this.notificacion.IdDatos,0).subscribe();
          }else{
            this.alertaDesusoDeAula(NomArea,NomAula,fotografia);
          }
        });
      }
    });
  }

  EnviarCorreo() {
    this.enviandoCorreo();
    this.notificacionService.enviarCorreo(this.datosCorreo.Mail,this.datosCorreo.NomUsuario,this.datosCorreo.ApeUsuario,this.datosCorreo.NomSede,
      this.formularioCorreo.get('NomCurso')?.value,this.formularioCorreo.get('NomProfesor')?.value,this.fechaFormateada,this.formularioCorreo.get('NomCarrera')?.value,
      this.datoLocalStorage.NomUsuario+""+this.datoLocalStorage.ApeUsuario,this.notificacion.NomAula,this.notificacion.CapturaFotografica).subscribe((response) => {
    }, (error) => {
      console.log("error al enviar el correo");
    });
    this.notificacionService.agregarReporte(this.notificacion.IdCurso,this.fechaActual,
    this.idCarreraSelecionada,this.formularioCorreo.get('IdUsuario')?.value,this.notificacion.IdAula,this.notificacion.IdDatos).subscribe((response) => {
      this.cerrarrModalCorreoPre();
      this.cerrarrModalCorreo(false,true);
    }, (error) => {
      console.log("error al generar reporte");
    });
  }

  enviandoCorreo(){
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

  cerrarrModalCorreo(PrevCorreo :boolean,enviado :boolean) {
    if(PrevCorreo){
      this.abrirModalCorreoPre();
    }else{
      if(!enviado){
        this.alertaDesusoDeAula(this.notificacion.NomArea,this.notificacion.NomAula,this.notificacion.CapturaFotografica);
      }else{
        this.recibitNotificacion = !this.recibitNotificacion;
        this.notificacionService.validarAlerta(this.notificacion.IdDatos,1).subscribe();
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
    if (Carrera.target.value === '-1') {
    } else {
      this.carrerasSede.forEach(elemento => {
        if(elemento.IdCarrera == Carrera.target.value) {
          this.formularioCorreo.patchValue({
            NomCarrera:  elemento.NomCarrera,
          });
          this.idCarreraSelecionada =elemento.IdCarrera;
        }
      });
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

  infoSwal(title: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }
}
