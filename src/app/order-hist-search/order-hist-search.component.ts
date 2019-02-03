import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-order-hist-search',
  templateUrl: './order-hist-search.component.html',
  styleUrls: ['./order-hist-search.component.less']
})
export class OrderHistSearchComponent implements OnInit {

  constructor(private socket: Socket, private serverConnect: ServerConnectService) { 

    // Listeners and initial component-build commands follow...
    for(let a=1; a<=31; a++){
      if(a<10){
        this.days.push("0" + a + "");
      } else {
        this.days.push("" + a + "");
      }
    }
    this.socket.on('orderHistoryDump', (data)=>{
      console.log(data);
      if(data.length > 0){
        this.orderHistoryResult = data;
        this.viewedOrderItems = JSON.parse(this.orderHistoryResult[0].items);
        document.getElementById('noOrderHist').classList.add('hidden');
      } else {
        this.orderHistoryResult = [];
        document.getElementById('noOrderHist').classList.remove('hidden');
      }
    });
  }

  ngOnInit() {
  }

  // Component attributes follow...
  orderHistoryResult: any[] = [];
  viewedOrderItems: any[] = [];

  days: string[] = [];
  months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  years: string[] = ["2018", "2019"];

  selectedDay: string = "01";
  selectedMonth: string = this.months[0];
  selectedYear: string = this.years[0];

  // Function called when query criteria are submitted...
  orderHistSearch(){
    this.serverConnect.toServer('getOrderHistory', -1, this.selectedYear, this.selectedMonth, this.selectedDay);
  }

  // Function called when specific order number is clicked on...
  viewOrder(orderNum){
    for(let i=0; i<this.orderHistoryResult.length; i++){
      if(this.orderHistoryResult[i].ordernum == orderNum){
        this.viewedOrderItems = JSON.parse(this.orderHistoryResult[i].items);
      }
    }
  }
}
