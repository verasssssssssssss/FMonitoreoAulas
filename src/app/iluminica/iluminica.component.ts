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
import { timer } from "rxjs";
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
  
  constructor(private LuzService:dashboardService) {}

  ngOnInit(): void {
    this.getLux();
  }

  getLux(){
    this.LuzService.getIntensidadLuminica().subscribe((response) => {
        this.Datos = response.data;
        this.transform();
        this.Fechas= [this.Datos[0].Fecha,this.Datos[1].Fecha,this.Datos[2].Fecha,this.Datos[3].Fecha,this.Datos[4].Fecha,this.Datos[5].Fecha,this.Datos[6].Fecha,this.Datos[7].Fecha,this.Datos[8].Fecha,this.Datos[9].Fecha];
        this.Lux=[this.Datos[0].IntensidadLuminica,this.Datos[1].IntensidadLuminica,this.Datos[2].IntensidadLuminica,this.Datos[3].IntensidadLuminica,this.Datos[4].IntensidadLuminica,this.Datos[5].IntensidadLuminica,this.Datos[6].IntensidadLuminica,this.Datos[7].IntensidadLuminica,this.Datos[8].IntensidadLuminica,this.Datos[9].IntensidadLuminica];
        this.crearchar();
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
    timer(8000).subscribe(() => {
      this.chartOptions={};
      this.getLux();
    });
  }




  transform() {
    this.Datos.forEach(element => {
      const parts = element.Fecha.split('T');
      element.Fecha=parts[1].slice(0, -5);
    });
  }
}
