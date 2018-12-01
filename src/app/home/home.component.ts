import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService) { }

  ngOnInit() {
    this.serverTest();
  }

  serverTest(){
    this.serverConnect.validate(1234);
  }
}
