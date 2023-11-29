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

  constructor(private humedadService:dashboardService, private loginService:LoginService) {}

  getTempHumedad(){
    this.humedadService.getTempHumedad().subscribe(async (response) => {
        this.Datos = await response.data;
        this.chart.updateOptions({
          xaxis: {
            type: "datetime",
            categories: [this.Datos[0].Fecha,this.Datos[1].Fecha,this.Datos[2].Fecha,this.Datos[3].Fecha,this.Datos[4].Fecha,this.Datos[5].Fecha,this.Datos[6].Fecha,this.Datos[7].Fecha,this.Datos[8].Fecha,this.Datos[9].Fecha]
          },
        });

        this.chart.updateSeries([{
          name: "Temperatura",
          data:[this.Datos[0].Temperatura,this.Datos[1].Temperatura,this.Datos[2].Temperatura,this.Datos[3].Temperatura,this.Datos[4].Temperatura,this.Datos[5].Temperatura,this.Datos[6].Temperatura,this.Datos[7].Temperatura,this.Datos[8].Temperatura,this.Datos[9].Temperatura]
        },
        {
          name: "Humedad",
          data: [this.Datos[0].Humedad,this.Datos[1].Humedad,this.Datos[2].Humedad,this.Datos[3].Humedad,this.Datos[4].Humedad,this.Datos[5].Humedad,this.Datos[6].Humedad,this.Datos[7].Humedad,this.Datos[8].Humedad,this.Datos[9].Humedad]
        }
      ],true);
    });
  }

  ngOnInit(): void {
    this.crearchar();
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
    this.getTempHumedad();
    setInterval(() => {
        this.getTempHumedad();
    }, 8000); // 300.000 milisegundos = 5 minutos
  }

}