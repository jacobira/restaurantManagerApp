import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket) { 

  }


  ngOnInit() {
  
  }

  // Function called on click to access kitchen page...
  getOpenOrders(){
    this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }
  
}