import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket) { }


  ngOnInit() {
    
  }

  getOpenOrders(){
    this.serverConnect.toServer('getOpenOrders');
  }
}
