import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { interval } from "rxjs";
import { DatosHumedadTemperatura } from "src/Clases/Datos";
import { dashboardService } from "src/Service/dashboard/dashboard.service";
import { LoginService } from "src/Service/login/login.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-humedad',
  templateUrl: './humedad.component.html',
  styleUrls: ['./humedad.component.css']
})
export class HumedadComponent {
  @ViewChild("realchart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  Datos!:DatosHumedadTemperatura[];
  obtener:boolean=true;

  constructor(public humedadService:dashboardService, private loginService:LoginService) {}

  getTempHumedad(){
    this.humedadService.getTempHumedad().subscribe(async (response) => {
        this.Datos = await response.data;
        this.chart.updateOptions({
          xaxis: {
            type: "datetime",
            categories: [this.Datos[0].Fecha,this.Datos[1].Fecha,this.Datos[2].Fecha,this.Datos[3].Fecha,this.Datos[4].Fecha,this.Datos[5].Fecha,this.Datos[6].Fecha,this.Datos[7].Fecha,this.Datos[8].Fecha,this.Datos[9].Fecha]
          },
        });
        this.humedadService.Temperatura
        this.chart.updateSeries([{
          name: "Temperatura",
          data:[this.Datos[0].Temperatura,this.Datos[1].Temperatura,this.Datos[2].Temperatura,this.Datos[3].Temperatura,this.Datos[4].Temperatura,this.Datos[5].Temperatura,this.Datos[6].Temperatura,this.Datos[7].Temperatura,this.Datos[8].Temperatura,this.Datos[9].Temperatura]
        },
        {
          name: "Humedad",
          data: [this.Datos[0].Humedad,this.Datos[1].Humedad,this.Datos[2].Humedad,this.Datos[3].Humedad,this.Datos[4].Humedad,this.Datos[5].Humedad,this.Datos[6].Humedad,this.Datos[7].Humedad,this.Datos[8].Humedad,this.Datos[9].Humedad]
        }
      ],true);
      this.humedadService.Temperatura = this.Datos[0].Temperatura;
      this.humedadService.Humedad = this.Datos[0].Humedad;
    });
  }

  ngOnInit() {
    this.crearchar();
    const startTime = 8 * 60 + 10;
    const endTime = 20 * 60; 
    const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
    let initialDelay = 0;
    if (currentTime < startTime) {
      initialDelay = (startTime - currentTime) * 60 * 1000;
    } else {
      initialDelay = (5 - (currentTime % 5)) * 60 * 1000; 
    }
  
    this.getTempHumedad();
  
    interval(60 * 1000) 
      .subscribe(() => {
        const current = new Date().getHours() * 60 + new Date().getMinutes();
        if (current >= startTime && current <= endTime && current % 5 === 0) {
          this.getTempHumedad();
        }
      });
  
    setTimeout(() => {
      this.getTempHumedad();
    }, initialDelay);
  }

  crearchar(){
    this.chartOptions = {
      series: [
        {
          name: "Temperatura",
          data: [0,0,0,0,0,0,0,0,0,0]
        },
        {
          name: "Humedad",
          data: [0,0,0,0,0,0,0,0,0,0]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: ['2023-08-27 06:47:21',"2023-08-27 04:47:21",'2023-08-27 06:47:21',"2023-08-27 04:47:21",'2023-08-27 06:47:21',"2023-08-27 04:47:21",'2023-08-27 06:47:21',"2023-08-27 04:47:21",'2023-08-27 06:47:21',"2023-08-27 04:47:21"]
      },
      tooltip: {
        x: {
          format: "HH:mm"
        }
      }
    };
  }

}