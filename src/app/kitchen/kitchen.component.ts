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

      if(this.openOrders.length == 0){
        if(document.getElementById('completeBtn')){
          this.openOrders = data;
          if(data.length == 0){
            document.getElementById('completeBtn').classList.add('faded');
          }
          if(data.length !== 0){
            document.getElementById('completeBtn').classList.remove('faded');
          }
          this.viewOrder(this.openOrders[0]);
          this.firstLoad = false;
        }
      }

      this.openOrders = data;
      if(document.getElementById('completeBtn')){
        if(data.length == 0){
          document.getElementById('completeBtn').classList.add('faded');
        }
        if(data.length !== 0){
          document.getElementById('completeBtn').classList.remove('faded');
        }
      }
      // console.log(this.openOrders);
      if(this.firstLoad){
        this.viewOrder(this.openOrders[0]);
        this.firstLoad = false;
      }
    });

    this.socket.on('openOrdersDumpAfterComplete', (data)=>{
      this.openOrders = data;
      if(data.length == 0){
        document.getElementById('completeBtn').classList.add('faded');
      }
      if(data.length !== 0){
        document.getElementById('completeBtn').classList.remove('faded');
      }
      this.viewOrder(this.openOrders[0]);
    });

    this.socket.on('orderDetailsDump', (data)=>{
      let parsedData = JSON.parse(data);
      if(parsedData !== null){
        this.viewedOrder = parsedData
        this.viewedOrderNum = parsedData.ordernum;
        this.viewedOrderItems = JSON.parse(parsedData.items);
      }
      else{
        this.viewedOrder = '';
        this.viewedOrderNum = '';
        this.viewedOrderItems = [];
      }
    });

    this.socket.on('orderMarkedComplete', ()=>{
      this.serverConnect.toServer('getOpenOrdersAfterComplete', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                      this.serverConnect.currDay);
    });
    this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                      this.serverConnect.currDay);
    this.setRefresh();
  }

  firstLoad: boolean = true;

  openOrders: string[] = [];
  viewedOrder: any = {};

  viewedOrderNum: string = "";
  viewedOrderItems: any[];

  ngOnInit() {

  }

  viewOrder(orderNum){
    this.serverConnect.toServer('getOrderDetails', orderNum, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }

  completeOrder(){
   
    this.serverConnect.toServer('completeOrder', this.viewedOrderNum, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }

  setRefresh(){
    window.setInterval(()=>{
      this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                        this.serverConnect.currDay);
    }, 2000);
  }
}
