import { Component } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { filter, interval, timer } from "rxjs";
import { DatosCo2Tvoc } from "src/Clases/Datos";
import { dashboardService } from "src/Service/dashboard/dashboard.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: any; //ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
};

@Component({
  selector: 'app-co2',
  templateUrl: './co2.component.html',
  styleUrls: ['./co2.component.css']
})
export class Co2Component {
  public chart1options!: Partial<ChartOptions>;
  public chart2options!: Partial<ChartOptions>;

  Datos!: DatosCo2Tvoc[];

  chart1Data!: any[];
  chart2Data!: any[];
 
  booleanco2tvoc: boolean = false;

  constructor(public co2tvocService:dashboardService) {}
  ngOnInit() {
    const startTime = 8 * 60 + 10;
    const endTime = 23 * 60; 
    const currentTime = new Date().getHours() * 60 + new Date().getMinutes(); 
    let initialDelay = 0;
    if (currentTime < startTime) {
      initialDelay = (startTime - currentTime) * 60 * 1000; 
    } else {
      initialDelay = (5 - (currentTime % 5)) * 60 * 1000;
    }
    this.getCt();
    interval(60 * 1000) 
      .subscribe(() => {
        const current = new Date().getHours() * 60 + new Date().getMinutes();
        if (current >= startTime && current <= endTime && current % 5 === 0) {
          this.getCt();
        }
      });
  
    setTimeout(() => {
      this.getCt();
    }, initialDelay);
  }

  getCt(){
    this.co2tvocService.getco2tvoc().subscribe((response) => {
        this.chart1options = {};
        this.chart2options = {};
        this.Datos = response.data;
        this.chart1Data = [
          [this.Datos[0].Fecha, this.Datos[0].NivelesDeCO2],
          [this.Datos[1].Fecha, this.Datos[1].NivelesDeCO2],
          [this.Datos[2].Fecha, this.Datos[2].NivelesDeCO2],
          [this.Datos[3].Fecha, this.Datos[3].NivelesDeCO2],
          [this.Datos[4].Fecha, this.Datos[4].NivelesDeCO2],
          [this.Datos[5].Fecha, this.Datos[5].NivelesDeCO2],
          [this.Datos[6].Fecha, this.Datos[6].NivelesDeCO2],
        ];

        this.chart2Data = [
          [this.Datos[0].Fecha, this.Datos[0].Tvoc],
          [this.Datos[1].Fecha, this.Datos[1].Tvoc],
          [this.Datos[2].Fecha, this.Datos[2].Tvoc],
          [this.Datos[3].Fecha, this.Datos[3].Tvoc],
          [this.Datos[4].Fecha, this.Datos[4].Tvoc],
          [this.Datos[5].Fecha, this.Datos[5].Tvoc],
          [this.Datos[6].Fecha, this.Datos[6].Tvoc],
        ];
        this.crearchar();
        this.co2tvocService.co2=this.Datos[0].NivelesDeCO2;
        this.booleanco2tvoc=true;
      });
  }


  crearchar() {
    this.chart1options = {
      series: [
        {
          name: "chart1",
          data: this.chart1Data 
        }
      ],
      chart: {
        id: "fb",
        group: "social",
        type: "line",
        height: 160
      },
      colors: ["#008FFB"],
      yaxis: {
        tickAmount: 7,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart2options = {
      series: [
        {
          name: "chart2",
          data: this.chart2Data 
        }
      ],
      chart: {
        id: "tw",
        group: "social",
        type: "line",
        height: 160
      },
      colors: ["#546E7A"],
      yaxis: {
        tickAmount: 7,
        labels: {
          minWidth: 40
        }
      }
    };
  }

  public commonOptions: Partial<ChartOptions> = {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    toolbar: {
      tools: {
        selection: false
      }
    },
    markers: {
      size: 6,
      hover: {
        size: 10
      }
    },
    tooltip: {
      followCursor: false,
      theme: "dark",
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return "";
          }
        }
      }
    },
    grid: {
      clipMarkers: false
    },
    xaxis: {
      type: "datetime"
    }
  };

  transform() {
    this.Datos.forEach(element => {
      const parts = element.Fecha.split('T');
      element.Fecha=parts[1].slice(0, -5);
    });
  }
}
