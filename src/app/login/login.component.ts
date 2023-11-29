import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from 'src/Clases/Usuarios';
import { LoginService } from 'src/Service/login/login.service';
import {dashboardService} from 'src/Service/dashboard/dashboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  error = false;

  hoverColor: string = 'black';

  constructor(private router: Router, private loginService: LoginService,private dashboardService: dashboardService) { }

  IniciarSesion(Mail: string, Contrasenia: string) {
    if (Mail != "" && Contrasenia != "") {
      this.loginService.IniciarSesion(Mail, Contrasenia).subscribe((response) => {
        if (response.ok) {
          this.loginService.datoLocalStorage = response.data[0];
          this.loginService.datoLocalStorage.token = response.token;
          localStorage.setItem('UsuarioLogueado', JSON.stringify(this.loginService.datoLocalStorage))
          this.router.navigate(['/home']);
        }
      }, (error) => {
        this.error = true;
      });
    }
  }

  verDashBoard() {
    this.loginService.datoLocalStorage = {
      IdUsuario:0,
      NomUsuario:"0",
      ApeUsuario:"0",
      Mail:"0",
      IdRol:0,
      IdSede:0,
      IdCarrera:0,
      IdCiudad:0,
      token:"0",
  }
    this.dashboardService.idAula=33;
    this.dashboardService.NomAula="D1FM"
    localStorage.setItem('UsuarioLogueado', JSON.stringify(this.loginService.datoLocalStorage))
    this.router.navigate(['/dashboard']);
  }

  onMouseEnter() {
    this.hoverColor = 'green'; 
  }

  onMouseLeave() {
    this.hoverColor = 'black'; 
  }

}
