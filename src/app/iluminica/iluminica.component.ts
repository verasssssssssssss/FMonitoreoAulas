import { Component, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { interval, timer } from "rxjs";
import { DatosIntensidadLuminica } from "src/Clases/Datos";
import { dashboardService } from "src/Service/dashboard/dashboard.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Component({
  selector: 'app-iluminica',
  templateUrl: './iluminica.component.html',
  styleUrls: ['./iluminica.component.css']
})
export class IluminicaComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  Datos!:DatosIntensidadLuminica[];
  Lux:number[]=[0,0,0,0,0,0,0,0,0,0];
  Fechas:string[]=["1","2","3","4","5","6","7","8","9","10"];
  obtener:boolean=true;
  booleanIntensidadLuminica: boolean = false;

  constructor(private LuzService:dashboardService) {}

  ngOnInit() {
    const startTime = 8 * 60 + 10;
    const endTime = 20 * 60;
    const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
    let initialDelay = 0;
    if (currentTime < startTime) {
      initialDelay = (startTime - currentTime) * 60 * 1000; 
    } else {
      initialDelay = (5 - (currentTime % 5)) * 60 * 1000;
    }
    this.getLux();

    interval(60 * 1000)
      .subscribe(() => {
        const current = new Date().getHours() * 60 + new Date().getMinutes();
        if (current >= startTime && current <= endTime && current % 5 === 0) {
          this.getLux();
        }
      });
  
    setTimeout(() => {
      this.getLux();
    }, initialDelay);
  }

  getLux(){
    this.LuzService.getIntensidadLuminica().subscribe((response) => {
      this.chartOptions={};
        this.Datos = response.data;
        this.transform();
        this.Fechas = this.Datos.slice(0, 10).map(item => item.Fecha).reverse();
        this.Lux = this.Datos.slice(0, 10).map(item => item.IntensidadLuminica).reverse();
        this.crearchar();
        this.booleanIntensidadLuminica=true;
      });
  }

  crearchar(){
    this.chartOptions = {
      series: [
        {
          name: "Lux",
          data: this.Lux
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: ["#fff", "#838b8e"]
        },
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: this.Fechas,
        tickPlacement: "on"
      },
      yaxis: {
        title: {
          text: "Lux"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    };
  }




  transform() {
    this.Datos.forEach(element => {
      const parts = element.Fecha.split('T');
      element.Fecha=parts[1].slice(0, -5);
    });
  }
}
