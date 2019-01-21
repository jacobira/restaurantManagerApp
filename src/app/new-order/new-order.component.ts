import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.less']
})
export class NewOrderComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket) {
    this.socket.emit('getMenuItems');
    this.socket.on('menuItemsDump', (preParseData)=>{
      console.log('menu items dump received');
      console.log(this.burgersItems);
      let data = JSON.parse(preParseData);
      console.log(data);
      this.currentMenu = data;
      for(let i=0; i<data.length; i++){
        if(data[i].category = "Burgers"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(JSON.parse(data[i].items)[item]);
          });
          console.log(items);
          this.burgersItems = items;
        }
        if(data[i].category = "Salads"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(data[i].items[item]);
          });
          this.saladsItems = items;
        }
        if(data[i].category = "Sides"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(data[i].items[item]);
          });
          this.sidesItems = items;
        }
        if(data[i].category = "Beverages"){
          let items: any = [];
          Object.keys(JSON.parse(data[i].items)).forEach(function(item){
            items.push(data[i].items[item]);
          });
          this.beveragesItems = items;
        }
      }
    });
  }

  ngOnInit() {
  }

  currentMenu: any[] = [];

  burgersItems: any[] = [];
  saladsItems: any[] = [];
  sidesItems: any[] = [];
  beveragesItems: any[] = [];

  orderBuild: any[] = [];

}
