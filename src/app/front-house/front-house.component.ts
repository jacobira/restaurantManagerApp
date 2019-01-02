import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-front-house',
  templateUrl: './front-house.component.html',
  styleUrls: ['./front-house.component.less']
})
export class FrontHouseComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket) { 
    this.socket.on('orderDetailsDump', (data)=>{
      let parsedData = JSON.parse(data);
      this.viewedOrder = parsedData;
    });
    this.socket.on('unpaidOrdersDump', (data)=>{
      this.unpaidOrders = data;
    });
    this.serverConnect.toServer('getUnpaidOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth,
                                                        this.serverConnect.currDay);
    this.setRefresh();
  }
  
  unpaidOrders: string[] = [];
  viewedOrder: any = {};

  ngOnInit() {
  }

  viewOrder(orderNum, year, month, day){
    this.serverConnect.toServer('getOrderDetails', orderNum, year, month, day);
  }

  setRefresh(){
    window.setInterval(()=>{
      this.serverConnect.toServer('getUnpaidOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                        this.serverConnect.currDay);
    }, 2000);
  }
}
