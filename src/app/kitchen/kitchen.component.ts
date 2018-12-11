import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket) { 
    this.socket.on('openOrdersDump', (data)=>{
      this.openOrders = data;
      // console.log(this.openOrders);
    });
    this.socket.on('orderDetailsDump', (data)=>{
      let parsedData = JSON.parse(data);
      this.viewedOrder = parsedData;
    });
    window.setInterval(()=>{
      this.serverConnect.toServer('getOpenOrders');
    }, 2000);
    this.viewOrder(this.openOrders[0]);
  }

  openOrders: any = [];
  viewedOrder: any = {};

  ngOnInit() {

  }

  viewOrder(orderNum){
    this.serverConnect.dataToServer('getOrderDetails', orderNum);
  }
}
