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

    // Listeners and component-build commands follow...
    this.socket.on('openOrdersDump', (data)=>{

      if(this.openOrders.length == 0){
        if(document.getElementById('completeBtn')){
          this.openOrders = data;
          if(data.length == 0){
            document.getElementById('completeBtn').classList.add('faded');
            this.viewedOrder = {};
            this.viewedOrderNum = "";
            this.viewedOrderItems = [];
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
      if(this.firstLoad){
        this.viewOrder(this.openOrders[0]);
        this.firstLoad = false;
      }
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
      this.firstLoad = true;
      this.setRefresh();
    });
    this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                      this.serverConnect.currDay);
    this.setRefresh();
  }

  // Component attributes follow...
  firstLoad: boolean = true;

  openOrders: string[] = [];
  viewedOrder: any = {};

  viewedOrderNum: string = "";
  viewedOrderItems: any[];

  refreshFnc: any;

  ngOnInit() {

  }

  // Function called when an order is clicked on...
  viewOrder(orderNum){
    this.serverConnect.toServer('getOrderDetails', orderNum, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }

  // Function called when an order is marked as completed by the kitchen...
  completeOrder(){
   
    this.serverConnect.toServer('completeOrder', this.viewedOrderNum, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }

  // Function keeping list of open orders constantly updated...
  setRefresh(){
    clearTimeout(this.refreshFnc);
    this.refreshFnc = window.setInterval(()=>{
      this.serverConnect.toServer('getOpenOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                        this.serverConnect.currDay);
    }, 500);
    this.refreshFnc;
  }
}
