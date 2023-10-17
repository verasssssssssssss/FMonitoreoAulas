import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ReportesComponent } from './reportes/reportes.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { DatePipe } from '@angular/common';

import {AngularFireModule} from '@angular/fire/compat'
import {AngularFireStorageModule} from '@angular/fire/compat/storage'
import {environment } from 'src/environments/environment';
import {HorarioComponent } from './horario/horario.component';

import { NgApexchartsModule } from "ng-apexcharts";
import { dashboardComponent } from './dashboard/dashboard.component';
import { HumedadComponent } from './humedad/humedad.component';
import { Co2Component } from './co2/co2.component';
import { IluminicaComponent } from './iluminica/iluminica.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ReportesComponent,
    HomeComponent,
    NotificacionComponent,
    HorarioComponent,
    dashboardComponent,
    HumedadComponent,
    Co2Component,
    IluminicaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }