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
      this.viewedOrder = parsedData.ordernum;
      this.viewedOrderItems = parsedData.items;
      this.viewedOrderComplete = parsedData.complete;
      this.viewedOrderFinalized = parsedData.finalized;
    });
    this.socket.on('unpaidOrdersDump', (data)=>{
      this.unpaidOrders = data;
      this.serverConnect.toServer('getCompleteOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth,
                                                            this.serverConnect.currDay);
    });
    this.socket.on('completeOrdersDump', (data)=>{
      this.completeOrders = data;
      for(let i=0; i<this.completeOrders.length; i++){
        for(let a=0; a<this.unpaidOrders.length; a++){
          if(this.unpaidOrders[a] == this.completeOrders[i]){
            document.getElementById(`${this.unpaidOrders[a]}`).classList.add('completed');
          }
        }
      };
    });
    this.serverConnect.toServer('getUnpaidOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth,
                                                        this.serverConnect.currDay);
    this.setRefresh();
  }
  
  unpaidOrders: string[] = [];

  completeOrders: string[] = [];

  viewedOrder: string = "0";
  viewedOrderItems: string[] = [];
  viewedOrderComplete: boolean = false;
  viewedOrderFinalized: boolean = false;

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
