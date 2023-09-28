import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from 'src/Clases/Usuarios';
import { LoginService } from 'src/Service/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  error = false;

  constructor(private router: Router, private loginService: LoginService) { }

  IniciarSesion(Mail: string, Contrasenia: string) {
    if (Mail != "" && Contrasenia != "") {
      this.loginService.IniciarSesion(Mail, Contrasenia).subscribe((response) => {
        if (response.ok) {
          localStorage.setItem('UsuarioLogueado', JSON.stringify(response.data))
          this.router.navigate(['/home']);
        }


      }, (error) => {
        console.log("Credenciales incorrectas");
        this.error = true;
      });
    } else {
      console.log("Debe ingresar las credenciales");
    }
  }
}
