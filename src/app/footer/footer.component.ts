import { Component } from '@angular/core';
import { HomeService } from 'src/Service/home/home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(public homeService:HomeService) {}

}
