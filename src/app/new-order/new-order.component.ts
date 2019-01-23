import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.less']
})
export class NewOrderComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket, private router: Router) {
    this.socket.emit('getMenuItems');
    this.socket.on('menuItemsDump', (preParseData)=>{
      console.log('menu items dump received');
      let data = JSON.parse(preParseData);
      console.log(data);
      this.currentMenu = data;
      for(let i=0; i<data.length; i++){
        if(data[i].category == "Burgers"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(JSON.parse(data[i].items)[item]);
          });
          console.log(items);
          this.burgersItems = items;
          console.log('found burgers category');
        }
        if(data[i].category == "Salads"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(JSON.parse(data[i].items)[item]);
          });
          this.saladsItems = items;
          console.log('found salads category');
        }
        if(data[i].category == "Sides"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(JSON.parse(data[i].items)[item]);
          });
          this.sidesItems = items;
          console.log('found sides category');
        }
        if(data[i].category == "Beverages"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(JSON.parse(data[i].items)[item]);
          });
          this.beveragesItems = items;
          console.log('found beverages category');
        }
      }
    });
  }

  ngOnInit() {
  }

  addToOrder(name, price, build){
    this.orderBuild.push({
      'name': name,
      'price': price,
      'build': build,
      'notes': ''
    });
    console.log(name);
  }

  submitOrder(){
    // let orderBuildToShip: any[] = [];
    // this.orderBuild.forEach(function(item){
    //   orderBuildToShip.push(JSON.stringify(item));
    // });
    this.serverConnect.toServer("submitOrder", JSON.stringify(this.orderBuild), this.serverConnect.currYear, this.serverConnect.currMonth, this.serverConnect.currDay);
    this.router.navigate(["/","frontHouse"]);
  }

  currentMenu: any[] = [];

  burgersItems: any[] = [];
  saladsItems: any[] = [];
  sidesItems: any[] = [];
  beveragesItems: any[] = [];

  orderBuild: any[] = [];

}
