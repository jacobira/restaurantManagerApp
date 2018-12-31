import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  year: string = '2018';
  month: string = 'JAN';
  day: string = '01';

  constructor(private serverConnect: ServerConnectService, private socket: Socket) { 
    this.socket.on('openOrdersDump', (data)=>{
      this.openOrders = data;
      // console.log(this.openOrders);
    });
    this.socket.on('orderDetailsDump', (data)=>{
      let parsedData = JSON.parse(data);
      this.viewedOrder = parsedData;
    });
    this.serverConnect.toServer('getOpenOrders', -1, this.year, this.month, this.day);
    this.setRefresh();
    // this.viewOrder(this.openOrders[0], this.year, this.month, this.day);
  }


  openOrders: any = [];
  viewedOrder: any = {};

  ngOnInit() {

  }

  viewOrder(orderNum, year, month, day){
    this.serverConnect.toServer('getOrderDetails', orderNum, year, month, day);
  }

  setRefresh(){
    window.setInterval(()=>{
      this.serverConnect.toServer('getOpenOrders', -1, this.year, this.month, this.day);
    }, 2000);
  }
}
