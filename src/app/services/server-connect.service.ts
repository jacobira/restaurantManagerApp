import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
 
@Injectable({
  providedIn: 'root'
})

export class ServerConnectService {

  // preset date values listed below for sample order testing...
  currYear: string = '2018';
  currMonth: string = 'JAN';
  currDay: string = '01';

  validated: boolean = false;
  mngr: boolean = false;
  currUser: string = '';

  constructor(private socket: Socket) { 
    let date = new Date();

    // ***comment out the following code to test sample orders from sample date 2019 JAN 01...
    // this.currYear = `${date.getFullYear()}`;
    // let monthNum = date.getMonth();
    // let monthConversions = [{'num': 0, 'month': 'JAN'},{'num': 1, 'month': 'FEB'},{'num': 2, 'month': 'MAR'},
    //   {'num': 3, 'month': 'APR'},{'num': 4, 'month': 'MAY'},{'num': 5, 'month': 'JUN'},
    //   {'num': 6, 'month': 'JUL'},{'num': 7, 'month': 'AUG'},{'num': 8, 'month': 'SEP'},
    //   {'num': 9, 'month': 'OCT'},{'num': 10, 'month': 'NOV'},{'num': 11, 'month': 'DEC'}];
    // for(let i=0; i<monthConversions.length; i++){
    //   if(monthNum == monthConversions[i].num){
    //     this.currMonth = monthConversions[i].month;
    //   }
    // };
    // this.currDay = `${date.getDate()}`;
    // console.log(`${this.currYear} ${this.currMonth} ${this.currDay}`);
    // ***(end of code to comment out for sample order and date usage)
  }

  // reqests located below...

  toServer(event, data?, year?, month?, day?){
    if(data !== -1){
      if(year && month && day){
        this.socket.emit(event, JSON.stringify({"data": data, "year": year, "month": month, "day": day}));
      }
      else{
        console.log(JSON.stringify({"data": data}));
        this.socket.emit(event, JSON.stringify({"data": data}));
      }
    }
    if(data === -1){
      if(year && month && day) {
        this.socket.emit(event, JSON.stringify({"year": year, "month": month, "day": day}));
      }
      else {
        this.socket.emit(event);
      }
    }
  }
}