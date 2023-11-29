import { Component} from '@angular/core';
import {dashboardService} from 'src/Service/dashboard/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class dashboardComponent {
  constructor(public dashboardService: dashboardService) {
  }
}
