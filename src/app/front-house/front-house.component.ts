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
      console.log(data);
      if(data !== null){
        let parsedData = JSON.parse(data);
        this.viewedOrder = parsedData.ordernum;
        this.viewedOrderItems = JSON.parse(parsedData.items);
        this.viewedOrderComplete = parsedData.complete;
        this.viewedOrderFinalized = parsedData.finalized;

        let subtotal: number = 0;
        for(let i=0; i<this.viewedOrderItems.length; i++){
          let item : any = this.viewedOrderItems[i];
          console.log(item);
          console.log(typeof(item));
          subtotal = subtotal + item.price;
        }
        this.orderSubtotal = subtotal.toString();
        this.orderTax = (subtotal * this.taxRate).toFixed(2);
        this.orderTotal = (subtotal + Number(this.orderTax)).toString();


        if(this.viewedOrderComplete == true){
          document.getElementById('completedMark').classList.remove('hidden')
        }
        if(this.viewedOrderComplete == false){
          if(document.getElementById('completedMar')){
            document.getElementById('completedMark').classList.add('hidden');
          }
        }
      }
      console.log(this.viewedOrderItems);
    });
    this.socket.on('unpaidOrdersDump', (data)=>{
      this.unpaidOrders = data;
      this.serverConnect.toServer('getCompleteOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth,
                                                            this.serverConnect.currDay);
      if(this.firstLoad == true){
        this.firstLoad = false;
        this.viewOrder(this.unpaidOrders[0]);
      }
    });
    this.socket.on('completeOrdersDump', (data)=>{
      this.completeOrders = data;
      for(let i=0; i<this.completeOrders.length; i++){
        for(let a=0; a<this.unpaidOrders.length; a++){
          if(this.unpaidOrders[a] == this.completeOrders[i]){
            // below if statement is for preventing errors when navigating and no such 
            // DOM element exists in the current view...
            if(document.getElementById(`${this.unpaidOrders[a]}`)){
              document.getElementById(`${this.unpaidOrders[a]}`).classList.add('completed');
            }
          }
        }
      };
    });
    this.serverConnect.toServer('getUnpaidOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth,
                                                        this.serverConnect.currDay);
    this.setRefresh();
  }
  
  firstLoad: boolean = true;

  unpaidOrders: string[] = [];

  completeOrders: string[] = [];

  viewedOrder: string = "0";
  viewedOrderItems: string[] = [];
  viewedOrderComplete: boolean = false;
  viewedOrderFinalized: boolean = false;

  orderSubtotal: string = '0';
  taxRate: number = .07;
  orderTax: string = '0';
  orderTotal: string = '0';

  ngOnInit() {
  }

  viewOrder(orderNum){
    console.log(orderNum);
    this.serverConnect.toServer('getOrderDetails', orderNum, this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
  }

  setRefresh(){
    window.setInterval(()=>{
      this.serverConnect.toServer('getUnpaidOrders', -1, this.serverConnect.currYear, this.serverConnect.currMonth, 
                                                        this.serverConnect.currDay);
    }, 2000);
  }
}
