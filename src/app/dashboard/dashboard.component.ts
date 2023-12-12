import { Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef} from '@angular/core';
import { AulasH } from 'src/Clases/Aulas';
import {dashboardService} from 'src/Service/dashboard/dashboard.service';
import { HumedadComponent } from 'src/app/humedad/humedad.component';
import { Co2Component } from 'src/app/co2/co2.component';
import { IluminicaComponent } from 'src/app/iluminica/iluminica.component';
import { LoginService } from 'src/Service/login/login.service';
import { HomeService } from 'src/Service/home/home.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class dashboardComponent {
  @ViewChild('dynamicComponenthumedad', { read: ViewContainerRef }) dynamicComponentHumedad!: ViewContainerRef;
  @ViewChild('dynamicComponentco2', { read: ViewContainerRef }) dynamicComponentCO2!: ViewContainerRef;
  @ViewChild('dynamicComponentiluminica', { read: ViewContainerRef }) dynamicComponentIluminica!: ViewContainerRef;

  humedadComponentRef!: ComponentRef<any>;
  co2ComponentRef!: ComponentRef<any>;
  iluminicaComponentRef!: ComponentRef<any>;

  Aulas!:AulasH[];
  
  constructor(public loginService: LoginService,public dashboardService: dashboardService,private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if(this.loginService.datoLocalStorage.token=="0"){
      this.dashboardService.getAulasConSensores().subscribe(
        (response) => {
          this.Aulas=response.data;
          this.dashboardService.idAula=this.Aulas[0].IdAula;
          this.dashboardService.NomAula=this.Aulas[0].NomAula;
          this.eliminarYCrearComponentes();
        },
        (error) => {
          console.error('Error al obtener datos:', error);
        });
    }else{
      this.loginService.datoLocalStorage = JSON.parse(localStorage.getItem('UsuarioLogueado')!);
      this.dashboardService.idAula=this.loginService.datoLocalStorage.Idsafsasau;
      this.dashboardService.NomAula=this.loginService.datoLocalStorage.Nosafsasio;
      this.eliminarYCrearComponentes();
    }
  }

  selecionarAula(NomAula : string, IdAula : number){
    this.dashboardService.idAula=IdAula;
    this.dashboardService.NomAula=NomAula;
    this.eliminarYCrearComponentes();
  }

    eliminarYCrearComponentes() {
      // Limpiar componentes existentes
      this.limpiarComponente(this.humedadComponentRef);
      this.limpiarComponente(this.co2ComponentRef);
      this.limpiarComponente(this.iluminicaComponentRef);
  
      // Crear componentes nuevamente
      this.crearComponente(HumedadComponent, this.dynamicComponentHumedad);
      this.crearComponente(Co2Component, this.dynamicComponentCO2);
      this.crearComponente(IluminicaComponent, this.dynamicComponentIluminica);
    }
  
    crearComponente(component: any, containerRef: ViewContainerRef) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(component);
      const componentRef = containerRef.createComponent(factory);
      
      // Asignar referencia del componente para poder eliminarlo después si es necesario
      if (component === HumedadComponent) {
        this.humedadComponentRef = componentRef;
      } else if (component === Co2Component) {
        this.co2ComponentRef = componentRef;
      } else if (component === IluminicaComponent) {
        this.iluminicaComponentRef = componentRef;
      }
    }
  
    limpiarComponente(componentRef: ComponentRef<any>) {
      if (componentRef) {
        componentRef.destroy();
      }
    }
}

