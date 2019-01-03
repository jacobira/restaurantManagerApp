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
      if(this.firstLoad){
        this.viewOrder(this.openOrders[0]);
        this.firstLoad = false;
      };
    });
    this.socket.on('orderDetailsDump', (data)=>{
      let parsedData = JSON.parse(data);
      console.log(parsedData);
      this.viewedOrder = parsedData
      this.viewedOrderNum = parsedData.ordernum;
      this.viewedOrderItems = JSON.parse(parsedData.items);
    });
    this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                      this.serverConnect.currDay);
    this.setRefresh();
  }

  firstLoad: boolean = true;

  openOrders: string[] = [];
  viewedOrder: any = {};

  viewedOrderNum: string = "0";
  viewedOrderItems: any[];

  ngOnInit() {

  }

  viewOrder(orderNum){
    this.serverConnect.toServer('getOrderDetails', orderNum, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }

  setRefresh(){
    window.setInterval(()=>{
      this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                        this.serverConnect.currDay);
    }, 2000);
  }
}
