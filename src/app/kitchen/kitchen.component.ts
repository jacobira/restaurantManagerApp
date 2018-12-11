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
      console.log(this.openOrders);
    });
    this.socket.on('orderDetailsDump', (data)=>{
      let parsedData = JSON.parse(data);
      this.displayDetails(parsedData);
    });
    window.setInterval(()=>{
      this.serverConnect.toServer('getOpenOrders');
    }, 5000);
  }

  openOrders: any = [1,2,3];
  viewedOrder: any = {};

  ngOnInit() {

  }

  viewOrderCall(orderNum){
    this.serverConnect.dataToServer('getOrderDetails', orderNum);
  }
  displayDetails(details){
    // DOM manipulation here using details parameter.
  }
}
