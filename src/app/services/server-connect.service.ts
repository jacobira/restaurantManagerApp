import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
 
@Injectable({
  providedIn: 'root'
})

export class ServerConnectService {

  currYear: string = '2018';
  currMonth: string = 'JAN';
  currDay: string = '01';

  validated: boolean = false;
  mngr: boolean = false;
  currUser: string = '';

  constructor(private socket: Socket) { 
    let date = new Date();
    this.currYear = `${date.getFullYear()}`;
    let monthNum = date.getMonth();
    let monthConversions = [{'num': 0, 'month': 'JAN'},{'num': 1, 'month': 'FEB'},{'num': 2, 'month': 'MAR'},
      {'num': 3, 'month': 'APR'},{'num': 4, 'month': 'MAY'},{'num': 5, 'month': 'JUN'},
      {'num': 6, 'month': 'JUL'},{'num': 7, 'month': 'AUG'},{'num': 8, 'month': 'SEP'},
      {'num': 9, 'month': 'OCT'},{'num': 10, 'month': 'NOV'},{'num': 11, 'month': 'DEC'}];
    for(let i=0; i<monthConversions.length; i++){
      if(monthNum == monthConversions[i].num){
        this.currMonth = monthConversions[i].month;
      }
    };
    this.currDay = `${date.getDate()}`;
  }

  // reqests located below...

  toServer(event, data?, year?, month?, day?){
    if(data != -1){
      if(year && month && day){
        this.socket.emit(event, {data, year, month, day});
      }
      else{
        this.socket.emit(event, data);
      }
    }
    if(data == -1){
      if(year && month && day) {
        this.socket.emit(event, {year, month, day});
      }
      else {
        this.socket.emit(event);
      }
    }
  }
}